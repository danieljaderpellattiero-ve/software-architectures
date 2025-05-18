const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    date: { type: Date, required: true },
    reason: { type: String, required: true },
  });
  
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
