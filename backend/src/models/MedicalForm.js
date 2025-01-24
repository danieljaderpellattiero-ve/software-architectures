const mongoose = require('mongoose');

const medicalFormSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  medicalHistory: { type: String, required: true },
  allergies: { type: String, default: '' },
  currentMedications: { type: String, default: '' },
  additionalInfo: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const MedicalForm = mongoose.model('MedicalForm', medicalFormSchema);

module.exports = MedicalForm;
