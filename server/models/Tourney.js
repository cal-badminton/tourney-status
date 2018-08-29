const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TourneySchema = new Schema({
  name: String,
  password: String,
  players: [String],
  status: String,
  queue: [{name: String, leftTeam: [String], rightTeam: [String]}],
  matches: [{name: String, leftTeam: [String], rightTeam: [String], time: Number}]
});

module.exports = mongoose.model('Tourney', TourneySchema);
