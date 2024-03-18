# AWS Key Management Service

Our service operates on a secure platform that automates the rotation of cryptographic keys at regular intervals. 
By automating this process, KeyRotate significantly reduces the risk of unauthorized access and data breaches. 
Whether you're managing keys for encryption, decryption, or authentication, our service streamlines the entire 
lifecycle, from generation to retirement.

## Goals

1. Automated Rotation: Set predefined schedules for key rotation, ensuring that encryption keys are consistently 
updated without manual intervention.

2. Centralized Management: Access a centralized dashboard to oversee all your cryptographic keys, simplifying 
administration and compliance efforts.

3. Secure Storage: Rest easy knowing that your keys are stored in a highly secure environment, protected by robust 
encryption and access controls.

4. Auditing and Compliance: Generate comprehensive audit logs to track key usage, rotations, and access, facilitating 
compliance with regulatory requirements such as GDPR, HIPAA, and more.

5. Customizable Policies: Tailor key rotation policies to align with your organization's security requirements 
and industry best practices.

## Deployment

To deploy this into your AWS account, you will need the [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html#install-sam-cli-instructions) installed and configured on your machine.

Prior to deployment, you will need to gather the following information:


Once you have obtained all the information above, you can deploy the code into your AWS account via the following commands:

```bash
cd api
sam build --parallel && sam deploy
sam deploy --guided
```

## Repo Layout

All the source code for the Angular front-end is located in the `ui` folder off the root. The backend code for the API is in the `api` folder.

## Contact

Any questions? Feel free to reach me on [LinkedIn](https://linkedin.com/in/odisharkins)