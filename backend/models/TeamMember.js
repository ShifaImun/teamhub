const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  email: String
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);
