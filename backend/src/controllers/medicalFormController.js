const MedicalForm = require('../models/MedicalForm');

// Создание новой медицинской формы
exports.createMedicalForm = async (req, res) => {
    try {
      console.log('Start creating medical form');
      const { medicalHistory, allergies, currentMedications, additionalInfo } = req.body;
  
      const medicalForm = new MedicalForm({
        patient: req.user.id,
        medicalHistory,
        allergies,
        currentMedications,
        additionalInfo,
      });
  
      console.log('Saving medical form to the database');
      await medicalForm.save();
  
      console.log('Medical form created successfully');
      res.status(201).json({ message: 'Medical form created successfully', medicalForm });
    } catch (error) {
      console.error('Error creating medical form:', error.message);
      res.status(500).json({ error: error.message });
    }
  };
  

// Получение всех форм пациента
exports.getMedicalForms = async (req, res) => {
  try {
    const medicalForms = await MedicalForm.find({ patient: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ medicalForms });
  } catch (error) {
    console.error('Error fetching medical forms:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Обновление медицинской формы
exports.updateMedicalForm = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const medicalForm = await MedicalForm.findOneAndUpdate(
      { _id: id, patient: req.user.id }, // Убедимся, что форма принадлежит текущему пациенту
      { ...updates, updatedAt: Date.now() },
      { new: true }
    );

    if (!medicalForm) {
      return res.status(404).json({ message: 'Medical form not found' });
    }

    res.status(200).json({ message: 'Medical form updated successfully', medicalForm });
  } catch (error) {
    console.error('Error updating medical form:', error.message);
    res.status(500).json({ error: error.message });
  }
};
