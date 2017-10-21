#!/bin/bash
ACCESS_KEY=$1
SECRET_KEY=$2
AWS_ACCOUNT_ID=$3
REGION=$4

NAME=serverless-batch:latest

aws configure set profile.serverless-batch.aws_access_key_id $ACCESS_KEY
aws configure set profile.serverless-batch.aws_secret_access_key $SECRET_KEY
aws configure set profile.serverless-batch.region $REGION

eval $(aws ecr get-login --no-include-email --profile serverless-batch --region $REGION)

docker build -t $NAME ./docker 
docker tag $NAME $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$NAME
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$NAME
