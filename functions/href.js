"use strict";

const AWS = require("aws-sdk");
const DynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

// Redirects to latest CFN template
module.exports.run = (event, context, callback) => {
  DynamoDB.get({
    TableName: 'serverless-projects-table',
    Key: {
      url: event.queryStringParameters.url,
    },
  }).promise().then((data) => {
    if (!data.Item) {
      return callback(null, {
        statusCode: 301,
        headers: {
          Location: 'https://s3.amazonaws.com/deploy-with-serverless/404.html',
        },
        body: ''
      });
    }

    const url = [
      'https://console.aws.amazon.com/cloudformation/home?region=us-east-1',
      `#/stacks/new?stackName=${data.Item.name}`,
      `&templateURL=https://s3.amazonaws.com/${data.Item.bucket}`,
      '/cloudformation-template-update-stack.json'
    ].join('');

    return callback(null, {
      statusCode: 301,
      headers: {
        Location: url,
      },
      body: ''
    });
  }).catch((error) => {
    console.error(error);

    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: 'project not found'
      }),
    });
  });
};
