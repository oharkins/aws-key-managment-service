const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    const secretName = process.env.SecretName;

    const secretsManager = new AWS.SecretsManager();

    try {
        const getSecretValueParams = {
            SecretId: secretName,
        };

        const secret = await secretsManager.getSecretValue(getSecretValueParams).promise();

        // Your logic to reset the secret value goes here
        // For demonstration purposes, let's just update the password to a random string
        const newPassword = generateRandomPassword();

        const updateSecretParams = {
            SecretId: secretName,
            SecretString: JSON.stringify({ password: newPassword }),
        };

        await secretsManager.updateSecret(updateSecretParams).promise();

        return {
            statusCode: 200,
            body: 'Secret reset successfully.',
        };
    } catch (error) {
        console.error('Error resetting secret:', error);
        return {
            statusCode: 500,
            body: 'Internal Server Error',
        };
    }
};

function generateRandomPassword() {
    // Your logic to generate a random password goes here
    // For simplicity, let's generate a 12-character alphanumeric password
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }
    return password;
}
