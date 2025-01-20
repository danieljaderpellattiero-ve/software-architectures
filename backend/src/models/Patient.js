const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  medicalHistory: { type: [String], default: [] },
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
