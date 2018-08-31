const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TourneySchema = new Schema({
  name: String,
  password: String,
  status: String,
  queue: [[String, [String], [String]]],
  matches: [[String, Number, String, String, String]]
});

module.exports = mongoose.model('Tourney', TourneySchema);
