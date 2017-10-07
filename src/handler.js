"use strict";

const AWS = require("aws-sdk");
const Batch = new AWS.Batch();
const DynamoDB = new AWS.DynamoDB.DocumentClient();
const S3 = new AWS.S3();
const fs = require('fs');

const createResponse = (statusCode, body, callback) => {
  callback(null, {
    statusCode,
    body
  });
};

/*
* In: https://github.com/serverless/serverless
* Out: serverless/serverless
*/
const extractProjectName = url => {
  const arr = url.split("/");
  return `${arr[3]}/${arr[4]}`;
};

const checkProject = url => {
  return DynamoDB.get({
    TableName: process.env.PROJECTS_TABLE,
    Key: {
      url
    }
  })
    .promise()
    .then(data => data.Item);
};

module.exports.run = (event, context, callback) => {
  const timestamp = Math.round(+new Date() / 1000);
  const url = event.body.url;
  const name = extractProjectName(url);
  const command = fs.readFileSync('./run.sh').split('\n');

  checkProject(url).then(data => {
    if (data) {
      console.log("Project already processed...");
      return createResponse(200, data, callback);
    }

    Batch.submitJob({
      jobDefinition: `${name}:${timestamp}`,
      jobName: name,
      jobQueue: process.env.JOB_QUEUE,
      containerOverrides: {
        command,
        environment: [{
          REPO_URL: url,
          REPO_NAME: name,
          BUILD_COMMAND: event.body.buildCmd || 'echo "Build cmd not specified"',
          PACKAGE_COMMAND: event.body.packageCmd || 'serverless package'
          ARTIFACTS_BUCKET_NAME: `${name}-artifacts-${timestamp}`,
          TEMPLATE_BUCKET_NAME: `${name}-template-${timestamp}`,
          TIMESTAMP: timestamp,
        }]
      }
    })
      .promise()
      .then(data => {
        return createResponse(200, {
          message: "job submitted",
          callback
        });
      })
      .catch(error => {
        return createResponse(400, error, callback);
      });
  });
};
