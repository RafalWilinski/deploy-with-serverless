"use strict";

const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const Batch = new AWS.Batch();
const DynamoDB = new AWS.DynamoDB.DocumentClient();

const createResponse = (statusCode, body, callback) => {
  callback(null, {
    statusCode,
    body: JSON.stringify(body)
  });
};

/*
* In: https://github.com/serverless/serverless
* Out: serverless-serverless
*/
const extractProjectName = url => {
  const arr = url.split("/");
  return `${arr[3]}-${arr[4]}`;
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
  const url = JSON.parse(event.body).url;
  const name = extractProjectName(url);
  const command = fs
    .readFileSync(path.join(process.cwd(), "run.sh"))
    .toString("utf8")
    .split("\n")
    .filter(x => x != "");

  console.log(`URL: ${url}, Name: ${name}`);

  checkProject(url)
    .then(data => {
      if (data) {
        console.log("Project already processed...");
        return createResponse(200, data, callback);
      }

      Batch.submitJob({
        jobDefinition: `${process.env.JOB_DEFINITON_NAME}`,
        jobName: name,
        jobQueue: process.env.JOB_QUEUE,
        containerOverrides: {
          command,
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

          return createResponse(
            200,
            {
              message: "job submitted"
            },
            callback
          );
        })
        .catch(error => {
          console.error(error);
          return createResponse(400, error, callback);
        });
    })
    .catch(error => {
      console.error(error);
      return createResponse(400, error, callback);
    });
};
