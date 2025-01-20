const Appointment = require('../models/Appointment');

// Создание запроса на запись
exports.createAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, reason } = req.body;

    if (!patient || !doctor || !date || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const appointment = new Appointment({ patient, doctor, date, reason });
    await appointment.save();
    res.status(201).json({ message: 'Appointment request created', appointment });
  } catch (error) {
    console.error('Error creating appointment:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Получение всех запросов (для врача)
exports.getAppointments = async (req, res) => {
  try {
    const { role, id } = req.user;

    let appointments;
    if (role === 'doctor') {
      appointments = await Appointment.find({ doctor: id }).populate('patient doctor', 'name');
    } else if (role === 'patient') {
      appointments = await Appointment.find({ patient: id }).populate('doctor', 'name');
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Обновление статуса запроса (принять/отклонить)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: `Appointment ${status}`, appointment });
  } catch (error) {
    console.error('Error updating appointment status:', error.message);
    res.status(500).json({ error: error.message });
  }
};


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
  
  
  