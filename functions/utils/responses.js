const dataCode = (statusCode, body, callback) => {
  return callback(null, {
    statusCode,
    body: JSON.stringify(body)
  });
};

const redirect = (Location, callback) => {
  return callback(null, {
    statusCode: 301,
    body: '',
    headers: {
      Location,
      'Cache-Control': 'max-age=60',
    },
  });
}

module.exports = {
  dataCode,
  redirect
};



