#!/bin/bash

timestamp() {
  date +%s
}

aws configure set region us-east-1

# Clone repository and change directory
git clone $REPO_URL src
cd src

# Install dependencies
echo 'Installing dependencies...'
npm install

# Apply optional build commands like babel or webpack
# eval $BEFORE_CMD

# Change SLS bucket
python ../change-deployment-bucket.py $BUCKET

# Run `serverless package --stage dev`, this might be overriden
# eval $PACKAGE_CMD
serverless package --stage dev

# eval $AFTER_CMD

# Go to artifacts & compiled Cloudformation template path
cd .serverless

pwd

# Upload CFN Template
echo 'Uploading CFN template...'
aws s3 sync . s3://$BUCKET --exclude "*.zip" --acl public-read

# Put dynamodb item
aws dynamodb put-item \
  --table-name serverless-projects  \
  --item '{
    "url": {"S": "'"$REPO_URL"'"},
    "name": {"S": "'"$REPO_NAME"'"},
    "bucket": {"S": "'"$BUCKET"'"},
    "inProgress": {"BOOL": false}
  }'
