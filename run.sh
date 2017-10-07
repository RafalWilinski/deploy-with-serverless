#!/bin/bash -u

# AWS Batch Command

set -e

run() {
  echo 'Starting processing job...'
  (process) || {
    exit_code=$?
    echo 'Process exited with error'
    return $exit_code
  }

  echo 'Process finished successfully!'
}

process() {
  # Clone repository and change directory
  git clone $REPO_URL
  cd $REPO_NAME

  # Install dependencies
  echo 'Installing dependencies...'
  npm install

  # Apply optional build commands like babel or webpack
  $BUILD_COMMAND

  # Run `serverless package`, this might be overriden
  $PACKAGE_COMMAND

  # Go to artifacts & compiled Cloudformation template path
  cd .serverless

  echo 'Creating upload buckets...'
  aws s3 create-bucket --acl public-read --bucket $ARTIFACTS_BUCKET_NAME
  aws s3 create-bucket --acl public-read --bucket $TEMPLATE_BUCKET_NAME

  echo 'Uploading CFN template...'


  echo 'Uploading artifacts...'

}

run
