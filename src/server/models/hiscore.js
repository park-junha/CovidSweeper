const mongoose = require('mongoose');

const hiscoreSchema = new mongoose.Schema({
  time: {
    type: Number
    , required: true
  }
  , name: {
    type: String
    , required: true
  }
  , datetime: {
    type: Date
    , required: true
  }
  , difficulty: {
    type: String
    , required: true
  }
  , mines: {
    type: Number
    , required: true
  }
});

module.exports = mongoose.model('Hiscores', hiscoreSchema);
