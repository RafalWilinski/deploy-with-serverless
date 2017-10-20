"use strict";

const AWS = require("aws-sdk");
const DynamoDB = require("./services/dynamodb");
const response = require("./utils/responses");
const extractProjectName = require("./utils/extractProjectName");
const Lambda = new AWS.Lambda();

const returnReady = callback =>
  response.redirect(
    "https://s3.amazonaws.com/deploy-with-serverless/button-ready.svg",
    callback
  );

module.exports.run = (event, context, callback) => {
  // TODO: Check if built project is up to date

  const url = event.queryStringParameters.url;
  const before = event.queryStringParameters.before;
  const pkg = event.queryStringParameters.package;
  const after = event.queryStringParameters.after;

  DynamoDB.get({
    url
  })
    .then(item => {
      if (!item) {
        console.log("Project not found, submitting job...");

        Lambda.invoke({
          FunctionName: "deploy-with-serverless-dev-handler",
          Payload: JSON.stringify({
            url,
            before,
            package: pkg,
            after
          })
        })
          .promise()
          .then(() => {
            DynamoDB.put({
              inProgress: true,
              url,
              name: extractProjectName(url)
            })
              .then(data => {
                console.log(data);
                return returnReady(callback);
              })
              .catch(error => {
                console.error(error);
                return returnReady(callback);
              });
          })
          .catch(error => {
            console.error(error);
            return returnReady(callback);
          });

        return returnReady(callback);
      }

      console.log("Project already built...");

      return returnReady(callback);
    })
    .catch(error => {
      console.error(error);
      return returnReady(callback);
    });
};
