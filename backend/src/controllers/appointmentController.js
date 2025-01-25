const Appointment = require('../models/Appointment');

// Create an appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctor, patient, date, time, reason } = req.body;

    const appointment = new Appointment({ doctor, patient, date, time, reason });
    await appointment.save();

    res.status(201).json({ message: 'Appointment created successfully', appointment });
  } catch (error) {
    console.error('Error creating appointment:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Fetch appointments for a doctor or patient
exports.getAppointments = async (req, res) => {
  try {
    const { role, id } = req.user;

    const filter = role === 'doctor' ? { doctor: id } : { patient: id };
    const appointments = await Appointment.find(filter).populate('doctor patient', 'name email role');

    res.status(200).json({ message: 'Appointments fetched successfully', appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({ message: `Appointment ${status}`, appointment });
  } catch (error) {
    console.error('Error updating appointment status:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error.message);
    res.status(500).json({ error: error.message });
  }
};
