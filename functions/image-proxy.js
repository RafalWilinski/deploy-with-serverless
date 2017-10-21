"use strict";

const AWS = require("aws-sdk");
const DynamoDB = require("./services/dynamodb");
const response = require("./utils/responses");
const extractProjectName = require("./utils/extractProjectName");
const Lambda = new AWS.Lambda();
const S3 = new AWS.S3();

const createBucket = Bucket =>
  S3.createBucket({
    Bucket,
    ACL: "public-read"
  }).promise();

const returnReady = callback =>
  response.redirect(
    "https://s3.amazonaws.com/deploy-with-serverless/button-ready.svg",
    callback
  );

module.exports.run = (event, context, callback) => {
  // TODO: Check if built project is up to date

  const timestamp = +new Date();
  const url = event.queryStringParameters.url;
  const before = event.queryStringParameters.before;
  const pkg = event.queryStringParameters.package;
  const after = event.queryStringParameters.after;
  const bucket = `${extractProjectName(url)}-${timestamp}`;

  DynamoDB.get({
    url
  })
    .then(item => {
      if (!item) {
        console.log("Project not found, submitting job...");

        console.log(bucket);

        createBucket(bucket)
          .then(() => {
            return Lambda.invoke({
              FunctionName: "deploy-with-serverless-dev-handler",
              Payload: JSON.stringify({
                url,
                before,
                package: pkg,
                after,
                bucket
              })
            })
              .promise()
              .then(() => {
                DynamoDB.put({
                  inProgress: true,
                  url,
                  name: extractProjectName(url),
                  bucket
                }).then(data => {
                  console.log(data);
                  return returnReady(callback);
                });
              });
          })
          .catch(error => {
            console.error(error);
            return returnReady(callback);
          });
      }

      console.log("Project already built...");

      return returnReady(callback);
    })
    .catch(error => {
      console.error(error);
      return returnReady(callback);
    });
};
