const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const index = require('./routes/index');
const hiscores = require('./routes/hiscores');

//  Environmental variables check
if (!process.env.DB_URI) {
  console.error('ERR: No database URI in .env file.');
  process.exit('no database uri in .env');
}

if (!process.env.ORIGINS_ALLOWED) {
  console.log('WARN: ORIGINS_ALLOWED not specified in .env, defaulting to \"\".');
  process.env.ORIGINS_ALLOWED = '';
}

//  App
const app = express();

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => {
  console.error(error);
  process.exit('mongoose connection error');
});
db.once('open', () => console.log('Connected to database.'));

let corsOptions = {
  origin: process.env.ORIGINS_ALLOWED
  , optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('', index);
app.use('/hiscores', hiscores);

module.exports = app;
