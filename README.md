# Deploy with Serverless

Infrastructure for processing Serverless projects and creating one-click deployments.

![Infra](assets/infra_v2.png?raw=true "Infrastructure Overview")

## Demo
[![](https://v26mdkczs6.execute-api.us-east-1.amazonaws.com/dev/image?url=https://github.com/RafalWilinski/serverless-medium-text-to-speech)](https://v26mdkczs6.execute-api.us-east-1.amazonaws.com/dev/template?url=http://github.com/RafalWilinski/serverless-medium-text-to-speech)


*Clicking button above will start deploy procedure of [serverless-medium-text-to-speech](https://github.com/RafalWilinski/serverless-medium-text-to-speech) project on your AWS Account via CloudFormation*

### Goal
Goal of the project is to create a mechanism for 1-click deployments, similar to Deploy on Heroku or Create Stack (CloudFormation) buttons, for Serverless Framework based projects. 

## Adding to your own project
In `README.md`, add following button/image:
```
[![](https://kkcohgzei0.execute-api.us-east-1.amazonaws.com/dev/image?url=<YOUR_PROJECT_GITHUB_URL>)](https://kkcohgzei0.execute-api.us-east-1.amazonaws.com/dev/template?url=<YOUR_PROJECT_GITHUB_URL>)
```

All the magic like building project, uploading artifacts or creating CloudFormation template is handled automatically!

You can add following params to URL in order to change build procedure:
- `before` - command invoked before `serverless package --stage dev`, by default it's `null`
- `package` - by default `serverless package --stage dev`
- `after` - command invoked after `serverless package --stage dev`, by default it's `null`

E.g.:
```url
https://kkcohgzei0.execute-api.us-east-1.amazonaws.com/dev/image
?url=http://github.com/RafalWilinski/serverless-medium-text-to-speech
&before=npm%20run%20build
&package=serverless%20package%20--stage%20prod
&after=rm%20-fr%20node_modules
```

## Development
### Prerequisites
 - Node
 - AWS Account, AWS CLI & credentials Set
 - Serverless Framework
 - Docker

### Setup
```bash
git clone https://github.com/RafalWilinski/deploy-with-serverless
cd deploy-with-serverless
npm install
```

### Commands
 - `npm run deploy` - Deploys whole infrastructure, builds Docker image which processes projects and pushes that image to ECR
 - `npm run gen-passwd` - generates a random password for user which interacts with ECS
 - `npm run deploy-img` - deploys image asset to public bucket
 - `npm run deploy-static` - deploys 404 page
 - `npm run deploy-assets` - deploys both imgs and static pages
 

