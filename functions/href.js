"use strict";

const DynamoDB = require("./services/dynamodb");
const responses = require("./utils/responses");

const return404 = callback =>
  responses.redirect(
    "https://s3.amazonaws.com/deploy-with-serverless/404.html",
    callback
  );

// Redirects to latest CFN template
module.exports.run = (event, context, callback) => {
  DynamoDB.get({
    url: event.queryStringParameters.url
  })
    .then(item => {
      if (!item) {
        return return404(callback);
      }

      if (item.inProgress) {
        return responses.redirect(
          "https://s3.amazonaws.com/deploy-with-serverless/in-progress.html",
          callback
        );
      }

      const url = [
        "https://console.aws.amazon.com/cloudformation/home?region=us-east-1",
        `#/stacks/new?stackName=${item.name}`,
        `&templateURL=https://s3.amazonaws.com/${item.bucket}`,
        "/cloudformation-template-update-stack.json"
      ].join("");

      return responses.redirect(url, callback);
    })
    .catch(error => {
      console.error(error);
      return return404(callback);
    });
};
