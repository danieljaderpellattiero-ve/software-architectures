const Patient = require('../models/Patient');

// Создание пациента
exports.createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json({ message: 'Patient created successfully', patient });
  } catch (error) {
    console.error('Error creating patient:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// Получение списка пациентов
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json({ patients });
  } catch (error) {
    console.error('Error fetching patients:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Обновление пациента
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndUpdate(id, req.body, { new: true });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json({ message: 'Patient updated successfully', patient });
  } catch (error) {
    console.error('Error updating patient:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// Удаление пациента
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error.message);
    res.status(500).json({ error: error.message });
  }
};
