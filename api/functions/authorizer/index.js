const OktaJwtVerifier = require('@okta/jwt-verifier');

exports.MISSING_AUTH_HEADER_MESSAGE = 'Missing authorization header';
exports.EXPECTED_BEARER_TOKEN = 'Expected a Bearer token';

exports.handler = async (event, context) => {
    try {
        const authHeader = event.headers?.Authorization ?? event.headers?.authorization;
        if (!authHeader) {
            console.log(exports.MISSING_AUTH_HEADER_MESSAGE);
            context.fail('Unauthorized');
            return null;
        }

        let [authType, authToken] = authHeader.split(' ');
        let user = {};
        user.roles = ['account-admin'];


        if (authType !== 'Bearer') {
            console.log(exports.EXPECTED_BEARER_TOKEN);
            context.fail('Unauthorized');
            return null;
        }

        let sub = "123456";
        try {
          const jwtData = await exports.verifyJwt(authToken, process.env.ISSUER, process.env.AUDIENCES);
          sub = jwtData.claims.sub;
          user = {
              id: jwtData.claims.sub,
            ...user,
            ...jwtData.claims
          };
        } catch (error) {
            console.log(error);
          context.fail('Unauthorized');
          return null;
        }

        const rolePolicies = await exports.getRolePolicies(user.roles);
        const consolidatedRolePolicies = exports.consolidateRolePolicies(rolePolicies, event.requestContext);

        const requestContext = exports.generateContext(user, sub);
        const policy = exports.buildPolicy(user, consolidatedRolePolicies, requestContext);
        console.log(policy);
        return policy;
    } catch (err) {
        console.log(err, err.stack);
        context.fail('Error');
        return null;
    }
};

exports.buildPolicy = (user, rolePolicies, context) => {
    const policy = {
        principalId: user.id,
        policyDocument: {
            Version: '2012-10-17',
            Statement: []
        },
        context: context
    };

    if (rolePolicies.allowedPaths?.length) {
        policy.policyDocument.Statement.push(
            {
                Action: 'execute-api:Invoke',
                Effect: 'Allow',
                Resource: rolePolicies.allowedPaths
            });
    }

    if (rolePolicies.deniedPaths?.length) {
        policy.policyDocument.Statement.push({
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: rolePolicies.deniedPaths
        });
    }

    return policy;
};

exports.generateContext = (user, sub) => {
    return {
        sub,
        // userId: user.id,
        // tenantId: user.tenantId,
        ...user.firstName && { userFirstName: user.firstName },
        ...user.lastName && { userLastName: user.lastName }
    };
};

exports.verifyJwt = async (authToken, issuer, expectedAudience) => {
    const oktaAccessTokenVerifier = new OktaJwtVerifier({
        issuer: issuer,
        cacheMaxAge: 60 * 30 * 1000, // 30 minutes
        jwksRequestsPerMinute: 10000
    });

    return await oktaAccessTokenVerifier.verifyAccessToken(authToken, expectedAudience);
};

exports.getRolePolicies = async (roles) => {
    const rolePolicies = [];

    // TODO: Replace this with below logic once table is created and roles populated
    //if (roles.indexOf('account-admin') !== -1) {
    rolePolicies.push({ role: 'account-admin', paths: { allow: ['*'], deny: [] } });
    //} else {
    //  rolePolicies.push({ role: '', paths: { allow: [], deny: ['*'] } });
    //}

    // const command = exports.buildGetRolesCommand();
    // const result = await ddb.send(command);
    // if (result?.Item) {
    //   const authorizerRecord = unmarshall(result.Item);
    //   for (const role of roles) {
    //     const authorizerRole = authorizerRecord.roles.find((r) => r.role == role);
    //     if (authorizerRole) {
    //       rolePolicies.push(authorizerRole);
    //     }
    //   }
    // } else {
    //   logger.warn('There is no authorizer role record configured.');
    // }

    return rolePolicies;
};


exports.consolidateRolePolicies = (roles, requestContext) => {
    const allowedPaths = [];
    const deniedPaths = [];
    for (const role of roles) {
        if (role.paths?.allow?.length) {
            role.paths.allow.forEach((resource) => {
                const pathArn = exports.buildPathArn(requestContext, resource);
                if (!allowedPaths.includes(pathArn)) {
                    allowedPaths.push(pathArn);
                }
            });
        }

        if (role.paths?.deny?.length) {
            role.paths.deny.forEach((resource) => {
                const pathArn = exports.buildPathArn(requestContext, resource);
                if (!deniedPaths.includes(pathArn)) {
                    deniedPaths.push(pathArn);
                }
            });
        }
    }

    for (const allowedPath of allowedPaths) {
        const index = deniedPaths.indexOf(allowedPath);
        if (index > -1) {
            deniedPaths.splice(index, 1);
        }
    }

    return { allowedPaths, deniedPaths };
};

exports.buildPathArn = (requestContext, resource) => {
    const partition = process.env.AWS_REGION.includes('gov') ? 'aws-us-gov': 'aws';
    return `arn:${partition}:execute-api:${process.env.AWS_REGION}:${requestContext.accountId}:` +
        `${requestContext.apiId}/${requestContext.stage}/${resource}`;
};