#!/bin/bash
set -e

ACCESS_KEY=$1
SECRET_KEY=$2
AWS_ACCOUNT_ID=$3
REGION=$4

TIMESTAMP=`date +%s`
NAME=serverless-batch:$TIMESTAMP

aws configure set profile.serverless-batch.aws_access_key_id $ACCESS_KEY
aws configure set profile.serverless-batch.aws_secret_access_key $SECRET_KEY
aws configure set profile.serverless-batch.region $REGION

eval $(aws ecr get-login --profile serverless-batch)

docker build -t $NAME ./docker 
docker tag $NAME $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$NAME
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$NAME
