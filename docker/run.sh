#!/bin/bash

timestamp() {
  date +%s
}

aws configure set region us-east-1

# Create public S3 Bucket
DEPLOYMENT_BUCKET=com.deploy-with-sls.$REPO_NAME.$(timestamp)
echo Creating $DEPLOYMENT_BUCKET bucket...
aws s3api create-bucket --bucket $DEPLOYMENT_BUCKET --acl public-read

# Clone repository and change directory
git clone $REPO_URL
cd $REPO_NAME

# Install dependencies
echo 'Installing dependencies...'
npm install

# Apply optional build commands like babel or webpack
eval $BUILD_COMMAND

# Change SLS bucket
python ../change-deployment-bucket.py $DEPLOYMENT_BUCKET

# Run `serverless package`, this might be overriden
serverless package --stage dev

# Go to artifacts & compiled Cloudformation template path
cd .serverless

# Upload CFN Template
echo 'Uploading CFN template...'
aws s3 sync . s3://$DEPLOYMENT_BUCKET --exclude "*.zip" --acl public-read

# Put dynamodb item
aws dynamodb put-item \
  --table-name serverless-projects  \
  --item '{
    "url": {"S": "'"$REPO_URL"'"},
    "name": {"S": "'"$REPO_NAME"'"},
    "bucket": {"S": "'"$DEPLOYMENT_BUCKET"'"},
    "inProgress": {"BOOL": false}
  }'
