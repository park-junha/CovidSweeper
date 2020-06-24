require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

if (!process.env.DB_URI) {
  console.error('ERR: No database URI in .env file.');
  process.exit('no database uri in .env');
}

if (!process.env.PORT) {
  console.log('WARN: PORT not specified in .env, defaulting to 2000.');
  process.env.PORT = 2000;
}

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => {
  console.error(error);
  process.exit('mongoose connection error');
});
db.once('open', () => console.log('Connected to database.'));

app.use(express.json());

const index = require('./routes/index');
const hiscores = require('./routes/hiscores');
app.use('', index);
app.use('/hiscores', hiscores);

app.listen(process.env.PORT, () => {
  console.log(`Started server on port ${process.env.PORT}.`);
});
