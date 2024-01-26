# cj-jpp-angular-template
Template to create new angular apps for the justice partner platform


## Things to change when using a generated repo:
### (This is temporary documentation and will be updated)
- workflows
  - Remove pull-request workflow from .github directory
  - Copy the workflows from the ./github/build-and-deploy-application-workflows to the .github/workflows directory
  - In the build-and-deploy-application-workflows file replace the value for ASSUME_ROLE_SESSION_NAME with your project name
  - Delete the value for build-and-deploy-application-workflows directory
    - the triggers are based on the main branch being called 'master' if your application main branch is different then this will need to be updated
  - CODEOWNERS
  - Environment specific workflows
    - Update region in role matrix in each environment workflow (defaulted to us-gov-west-1)
    - If multi region deployment is needed add each region to the region matrix array in the environment workflows
    - the CONFIG_ENV is used to tell sam which parameters to use in the samconfig.toml, the names can be changed if needed
    - the WORKFLOW_ENV can be changed to whatever makes sense to you deployment set up, but it must match an env in github
- README.md
- package.json name (re-create package-lock with `npm install` when this changes)
- angular.json
	- project name
	- browserTargets
  - baseHref needs to be the subdomain of the app surrounded by slashes ex. /subdomain/
    - configure the subdomain mapping for the deployed proxy Api in the Api Gateway console
- index.html title
- environments
	- product key
	- okta configuration settings
    - The okta client will also need to be updated with the redirect and signout uri's configured in the oidc settings
	- urls
    - baseUiUrl property should be the base domain url being used for the application
    - appHome property needs to updated to to use the subdomain of the application
- applicationName in `src\app\app.component.ts`
- tokenInterceptor role in `src\app\core\interceptors\token.interceptor.ts`
- samconfig.toml
  - replace these values with whatever makes sense for your application and environments
  - The region gets appended to the bucket name to prevent conflicts on multi region deployments
- GitHub
  - Add QA, Test, and Prod environment
  - Configure SSO setup
    - Recommend looking at /tools/sam-pipeline-bootstrap.js for a quickstart
    - Add an inline policy the generated PIPELINE_EXECUTION_ROLE_ARN role with
    ```
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "VisualEditor0",
          "Effect": "Allow",
          "Action": [
            "s3:PutObject",
            "s3:GetObject",
            "s3:DeleteObject"
          ],
          "Resource": "arn:aws-us-gov:s3:::<<S3 Bucket Name>>/*"
        },
        {
          "Sid": "VisualEditor1",
          "Effect": "Allow",
          "Action": [
            "s3:ListBucket",
            "s3:GetBucketLocation"
          ],
          "Resource": "arn:aws-us-gov:s3:::<<S3 Bucket Name>>"
        }
      ]
    }
    ```