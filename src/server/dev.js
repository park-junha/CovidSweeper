require('dotenv').config();
const app = require('./server.js');

//  Environmental variables check
if (!process.env.HOST) {
  console.log('WARN: HOST not specified in .env, defaulting to 127.0.0.1.');
  process.env.PORT = '127.0.0.1';
}

if (!process.env.PORT) {
  console.log('WARN: PORT not specified in .env, defaulting to 2000.');
  process.env.PORT = 2000;
}

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Serving on ${process.env.HOST}:${process.env.PORT}.`);
});
