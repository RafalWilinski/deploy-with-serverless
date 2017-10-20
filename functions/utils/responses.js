const dataCode = (statusCode, body, callback) => {
  return callback(null, {
    statusCode,
    body: JSON.stringify(body)
  });
};

const redirect = (Location, callback) => {
  return callback(null, {
    statusCode: 307,
    body: "",
    headers: {
      Location,
      "Cache-Control": "max-age=60",
      ETag: String(Math.random() * 1000000)
    }
  });
};

module.exports = {
  dataCode,
  redirect
};
