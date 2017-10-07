"use strict";

const AWS = require("aws-sdk");

const createResponse = (statusCode, body, callback) => {
  callback(null, {
    statusCode,
    body
  });
};

module.exports.run = (event, context, callback) => {};
