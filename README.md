# Deploy with Serverless

Infrastructure for processing Serverless projects and creating one-click deployments.

![Infra](assets/infra.png?raw=true "Infrastructure Overview")

## Demo
[![](https://kojv1kg009.execute-api.us-east-1.amazonaws.com/dev/image)](https://kojv1kg009.execute-api.us-east-1.amazonaws.com/dev/template?url=https://github.com/RafalWilinski/serverless-medium-text-to-speech)
*Clicking button above will start deploy procedure of [serverless-medium-text-to-speech](https://github.com/RafalWilinski/serverless-medium-text-to-speech) project on your AWS Account via CloudFormation*


## Development
## Prerequisites
 - Node
 - AWS Account & Credentials Set
 - Serverless Framework

### Commands
 - `npm run deploy` - Deploys whole infrastructure, builds Docker image which processes projects and pushes that image to ECR
 - `npm run gen-passwd` - generates a random password for user which interacts with ECS
 - `npm run deploy-img` - deploys image asset to public bucket
