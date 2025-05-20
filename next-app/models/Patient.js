import mongoose from 'mongoose';

// Define the patient schema
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  medicalHistory: { type: [String], default: [] },
});

// Check if the model is already defined; if not, define it
const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);

// Export the model
export default Patient;
