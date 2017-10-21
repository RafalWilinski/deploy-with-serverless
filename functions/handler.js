"use strict";

const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const extractProjectName = require("./utils/extractProjectName");
const response = require("./utils/responses");
const DynamoDB = require("./services/dynamodb");

const Batch = new AWS.Batch();

module.exports.run = (json, context, callback) => {
  const timestamp = Math.round(+new Date() / 1000);
  const name = extractProjectName(json.url);

  console.log(`URL: ${json.url}, Name: ${name}`);

  Batch.submitJob({
    jobDefinition: `${process.env.JOB_DEFINITON_NAME}`,
    jobName: name,
    jobQueue: process.env.JOB_QUEUE,
    containerOverrides: {
      environment: [
        {
          name: "REPO_URL",
          value: json.url
        },
        {
          name: "REPO_NAME",
          value: name
        },
        {
          name: "BEFORE_CMD",
          value: json.before || 'echo "Before cmd not specified"'
        },
        {
          name: "AFTER_CMD",
          value: json.after || 'echo "After cmd not specified"'
        },
        {
          name: "PACKAGE_CMD",
          value: json.package || "serverless package --stage dev"
        },
        {
          name: "BUCKET",
          value: json.bucket
        }
      ]
    }
  })
    .promise()
    .then(data => {
      console.log(data);
      return response.dataCode(
        200,
        JSON.stringify({ message: "OK" }),
        callback
      );
    })
    .catch(error => {
      console.error(error);
      return response.dataCode(200, JSON.stringify({ error }), callback);
    });
};
