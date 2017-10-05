'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = {
    host: process.env.host || "",
    dbURI: process.env.dbURI,
    tokenSecret: process.env.tokenSecret,
    fb: {
        clientID: process.env.fbClientID,
        clientSecret: process.env.fbClientSecret
    },
    aws: {
      accessKeyId: process.env.awsAccessKeyId,
      secretAccessKey: process.env.awsSecretAccessKey,
      region: process.env.awsRegion
    }
  }
} else {
  module.exports = require('./development.json');
}
