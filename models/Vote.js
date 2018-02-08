const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
    euteam: {
      type: String,
      required: true
    },
    points:{
      type: String,
      required: true
    }
  }
);

//Create collection and add Schema

const Vote = mongoose.model('Vote', VoteSchema);
module.exports = Vote;
