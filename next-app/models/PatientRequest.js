import mongoose from 'mongoose';

const patientRequestSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: false // false means pending, true means accepted
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const PatientRequest = mongoose.models.PatientRequest || mongoose.model('PatientRequest', patientRequestSchema);

export default PatientRequest; 