# Deploy with Serverless

Infrastructure for processing Serverless projects and creating one-click deployments.

![Infra](assets/infra.png?raw=true "Infrastructure Overview")


### Commands
 - `npm run deploy` - Deploys whole infrastructure, builds Docker image which processes projects and pushes that image to ECR
 - `npm run gen-passwd` - generates a random password for user which interacts with ECS
 - `npm run deploy-img` - deploys image asset to public bucket
