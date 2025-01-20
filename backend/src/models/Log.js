const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // Например: 'CREATE', 'UPDATE', 'DELETE'
  resource: { type: String, required: true }, // Например: 'User', 'MedicalRecord'
  resourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
