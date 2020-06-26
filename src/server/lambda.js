const AwsServerlessExpress = require('aws-serverless-express');
const app = require('./server');
const server = AwsServerlessExpress.createServer(app);

module.exports.universal = (event, ctx) => AwsServerlessExpress.proxy(
  server, event, ctx);
