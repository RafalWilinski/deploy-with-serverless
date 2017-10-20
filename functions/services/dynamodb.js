const AWS = require("aws-sdk");
const DynamoDB = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

const put = Item =>
  DynamoDB.put(
    Object.assign(
      {},
      { Item },
      {
        TableName: process.env.PROJECTS_TABLE
      }
    )
  ).promise();

const get = Key =>
  DynamoDB.get(
    Object.assign(
      {},
      { Key },
      {
        TableName: process.env.PROJECTS_TABLE
      }
    )
  )
    .promise()
    .then(data => data.Item);

module.exports = {
  put,
  get
};
