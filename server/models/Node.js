const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['building', 'gate', 'hostel', 'cafeteria', 'sports', 'lab', 'road', 'library', 'other'],
    default: 'other',
  },
  rooms: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Node', nodeSchema);
