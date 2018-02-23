const mongoose = require('mongoose');
const { Schema } = mongoose;

const RecordSchema = new Schema({
  name: String,
  id: String,
  score: Number,
});

const Record = mongoose.model('records', RecordSchema);

module.exports = { Record };
