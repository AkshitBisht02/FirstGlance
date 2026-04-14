const mongoose = require('mongoose');

const edgeSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
  },
});

// Compound index to avoid duplicate edges
edgeSchema.index({ from: 1, to: 1 }, { unique: true });

module.exports = mongoose.model('Edge', edgeSchema);
