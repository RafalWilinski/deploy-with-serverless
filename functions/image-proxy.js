"use strict";

const AWS = require("aws-sdk");

module.exports.run = (event, context, callback) => {
  // TODO: Check if built project is up to date

  callback(null, {
    statusCode: 301,
    headers: {
      Location: 'https://s3.amazonaws.com/deploy-with-serverless/button.png'
    },
    body: '',
  });
};
