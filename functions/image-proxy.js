"use strict";

const AWS = require("aws-sdk");
const DynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

module.exports.run = (event, context, callback) => {
  // TODO: Check if built project is up to date

  DynamoDB.get({
    TableName: 'serverless-projects-table',
    Key: {
      url: event.queryStringParameters.url,
    },
  }).promise().then((data) => {
    if (!data.Item) {
      // TODO: submit job to queue
      // TODO: add job to db of projects in progress
      // TODO: redirect to 404 or in progress depending on state
      
      return callback(null, {
        statusCode: 301,
        headers: {
          Location: 'https://s3.amazonaws.com/deploy-with-serverless/button-in-progress.svg' //TODO: create button
        },
        body: '',
      });
    }

    return callback(null, {
      statusCode: 301,
      headers: {
        Location: 'https://s3.amazonaws.com/deploy-with-serverless/button.svg'
      },
      body: '',
    });
  }).catch((error) => {
    console.log(error);
  });
};
