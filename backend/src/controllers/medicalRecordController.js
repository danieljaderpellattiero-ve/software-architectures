const MedicalRecord = require('../models/MedicalRecord');

// Создание новой медицинской записи
exports.createMedicalRecord = async (req, res) => {
    try {
      console.log('Start creating medical record');
      const { patient, notes } = req.body;
  
      const medicalRecord = new MedicalRecord({
        patient,
        doctor: req.user.id,
        notes,
      });
  
      console.log('Saving medical record to the database');
      await medicalRecord.save();
  
      console.log('Medical record created successfully');
      res.status(201).json({ message: 'Medical record created successfully', medicalRecord });
    } catch (error) {
      console.error('Error creating medical record:', error.message);
      res.status(500).json({ error: error.message });
    }
  };
  

// Получение всех записей пациента
exports.getMedicalRecords = async (req, res) => {
  try {
    const { patientId } = req.params;
    const medicalRecords = await MedicalRecord.find({ patient: patientId }).sort({ createdAt: -1 });
    res.status(200).json({ medicalRecords });
  } catch (error) {
    console.error('Error fetching medical records:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Обновление медицинской записи
exports.updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const medicalRecord = await MedicalRecord.findOneAndUpdate(
      { _id: id, doctor: req.user.id }, // Убедимся, что запись принадлежит текущему врачу
      { notes, updatedAt: Date.now() },
      { new: true }
    );

    if (!medicalRecord) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.status(200).json({ message: 'Medical record updated successfully', medicalRecord });
  } catch (error) {
    console.error('Error updating medical record:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Удаление медицинской записи
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const medicalRecord = await MedicalRecord.findOneAndDelete({ _id: id, doctor: req.user.id });

    if (!medicalRecord) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.status(200).json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    console.error('Error deleting medical record:', error.message);
    res.status(500).json({ error: error.message });
  }
};
