const fs = require('fs');
const AWS = require('aws-sdk');
const spawn = require('child_process').spawn;
const STS = new AWS.STS();

const handler = (data) => {
  console.log('Building & pushing docker image...');

  STS.getCallerIdentity({}).promise().then((payload) => {
    const deploy = spawn('/bin/sh', ['./scripts/push-image.sh', data.accessKey, data.secretKey, payload.Account, 'us-east-1']);

    deploy.stdout.on('data', (data) => console.log(data.toString()));
    deploy.stderr.on('data', (data) => console.error(data.toString()));
    deploy.on('close', (code) => console.log(`Process exited: ${code}`));
  }).catch(console.error);
}
 
module.exports = { handler }
