"use strict";

const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const extractProjectName = require('./utils/extractProjectName');
const response = require('./utils/responses');
const DynamoDB = require('./services/dynamodb');

const Batch = new AWS.Batch();

module.exports.run = (event, context, callback) => {
  const timestamp = Math.round(+new Date() / 1000);
  console.log(event);
  
  const url = JSON.parse(event.body).url;
  const name = extractProjectName(url);

  console.log(`URL: ${url}, Name: ${name}`);

  Batch.submitJob({
    jobDefinition: `${process.env.JOB_DEFINITON_NAME}`,
    jobName: name,
    jobQueue: process.env.JOB_QUEUE,
    containerOverrides: {
      environment: [
        {
          name: "REPO_URL",
          value: url
        },
        {
          name: "REPO_NAME",
          value: name
        },
        {
          name: "BUILD_COMMAND",
          value: event.body.buildCmd || 'echo "Build cmd not specified"'
        },
        {
          name: "PACKAGE_COMMAND",
          value: event.body.packageCmd || "serverless package"
        },
        {
          name: "ARTIFACTS_BUCKET_NAME",
          value: `${name}-artifacts-${timestamp}`
        },
        {
          name: "TEMPLATE_BUCKET_NAME",
          value: `${name}-template-${timestamp}`
        },
        {
          name: "TIMESTAMP",
          value: String(timestamp)
        }
      ]
    }
  })
    .promise()
    .then(data => {
      console.log(data);
      return response.dataCode(200, JSON.stringify({ message: 'OK' }), callback);
    })
    .catch(error => {
      console.error(error);
      return response.dataCode(200, JSON.stringify({ error }), callback);
    });
};
