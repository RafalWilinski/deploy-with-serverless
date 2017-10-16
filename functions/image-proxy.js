"use strict";

const AWS = require("aws-sdk");
const DynamoDB = require('./services/dynamodb');
const response = require('./utils/responses');
const extractProjectName = require('./utils/extractProjectName');
const Lambda = new AWS.Lambda();

const returnReady = (callback) => response.redirect('https://s3.amazonaws.com/deploy-with-serverless/button-ready.svg', callback);

module.exports.run = (event, context, callback) => {
  // TODO: Check if built project is up to date

  const url = event.queryStringParameters.url;
  const before = event.queryStringParameters.before;
  const package = event.queryStringParameters.package;
  const after = event.queryStringParameters.after;

  DynamoDB.get({
      url: event.queryStringParameters.url,
  }).then((item) => {
    if (!item) {
      Lambda.invoke({
        FunctionName: 'deploy-with-serverless-dev-handler',
        Payload: JSON.stringify({
          url,
          before,
          package,
          after,
        }),
      }).promise().then(() => {
        DynamoDB.put({
          inProgress: true,
          url: event.queryStringParameters.url,
          name: extractProjectName(event.queryStringParameters.url),
        }).then((data) => {
          console.log(data);
          return returnReady(callback);
        }).catch((error) => {
          console.error(error);
          return returnReady(callback);
        });
      }).catch((error) => {
        console.error(error);
        return returnReady(callback);
      });

      return returnReady(callback);
    }

    return returnReady(callback);
  }).catch((error) => {
    console.error(error);
    return returnReady(callback);
  });
};
