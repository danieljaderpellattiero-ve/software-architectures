const MedicalRecord = require('../models/MedicalRecord');

// Create a medical record
exports.createMedicalRecord = async (req, res) => {
  try {
    const { patient, doctor, notes } = req.body;

    const medicalRecord = new MedicalRecord({ patient, doctor, notes });
    await medicalRecord.save();

    res.status(201).json({ message: 'Medical record created successfully', medicalRecord });
  } catch (error) {
    console.error('Error creating medical record:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Fetch medical records for a patient
exports.getMedicalRecords = async (req, res) => {
  try {
    const { id } = req.user;

    const medicalRecords = await MedicalRecord.find({ patient: id }).populate('doctor', 'name email');
    res.status(200).json({ message: 'Medical records fetched successfully', medicalRecords });
  } catch (error) {
    console.error('Error fetching medical records:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update a medical record
exports.updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const medicalRecord = await MedicalRecord.findByIdAndUpdate(id, { notes }, { new: true });
    res.status(200).json({ message: 'Medical record updated successfully', medicalRecord });
  } catch (error) {
    console.error('Error updating medical record:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Delete a medical record
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const medicalRecord = await MedicalRecord.findByIdAndDelete(id);
    if (!medicalRecord) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.status(200).json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    console.error('Error deleting medical record:', error.message);
    res.status(500).json({ error: error.message });
  }
};
