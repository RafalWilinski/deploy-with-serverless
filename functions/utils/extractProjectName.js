/*
* In: https://github.com/serverless/serverless
* Out: serverless-serverless
*/
const extractProjectName = url => {
  const arr = url.split("/");
  return `${arr[3]}-${arr[4]}`;
};

module.exports = extractProjectName;
