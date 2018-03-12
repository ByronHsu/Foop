const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  id: String,
  sessionID: String,
});

const User = mongoose.model('users', UserSchema);

module.exports = { User };
