# aws-key-managment-service
AWS Key Management Service

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

All the source code for the NextJS front-end is located in the `ui` folder off the root. The backend code for the API is in the `api` folder.

## Contact

Any questions? Feel free to reach me on [LinkedIn](https://linkedin.com/in/odisharkins)