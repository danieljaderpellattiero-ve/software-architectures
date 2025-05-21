import mongoose from 'mongoose';

const acceptedPatientRequestSchema = new mongoose.Schema({
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
  request: {
    type: String,
    required: false
  },
  acceptedAt: {
    type: Date,
    default: Date.now
  }
});

const AcceptedPatientRequest = mongoose.models.AcceptedPatientRequest || mongoose.model('AcceptedPatientRequest', acceptedPatientRequestSchema);

export default AcceptedPatientRequest; 