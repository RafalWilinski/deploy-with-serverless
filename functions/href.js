"use strict";

const DynamoDB = require('./services/dynamodb');
const responses = require('./utils/responses');

// Redirects to latest CFN template
module.exports.run = (event, context, callback) => {
  DynamoDB.get({
    url: event.queryStringParameters.url,
  }).then((data) => {
    if (!data.Item) {
      return responses.redirect('https://s3.amazonaws.com/deploy-with-serverless/404.html', callback);
    }

    const url = [
      'https://console.aws.amazon.com/cloudformation/home?region=us-east-1',
      `#/stacks/new?stackName=${data.Item.name}`,
      `&templateURL=https://s3.amazonaws.com/${data.Item.bucket}`,
      '/cloudformation-template-update-stack.json'
    ].join('');

    return responses.redirect(url, callback);
  }).catch((error) => {
    console.error(error);

    return responses.dataCode(400, JSON.stringify({ message: 'project not found' }), callback);
  });
};
