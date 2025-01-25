const MedicalForm = require('../models/MedicalForm');

// Create a medical form
exports.createMedicalForm = async (req, res) => {
  try {
    const { patient, formDetails } = req.body;

    const medicalForm = new MedicalForm({ patient, formDetails });
    await medicalForm.save();

    res.status(201).json({ message: 'Medical form created successfully', medicalForm });
  } catch (error) {
    console.error('Error creating medical form:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Fetch medical forms for a patient
exports.getMedicalForms = async (req, res) => {
  try {
    const { id } = req.user;

    const medicalForms = await MedicalForm.find({ patient: id }).populate('patient', 'name email');
    res.status(200).json({ message: 'Medical forms fetched successfully', medicalForms });
  } catch (error) {
    console.error('Error fetching medical forms:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update a medical form
exports.updateMedicalForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDetails } = req.body;

    const medicalForm = await MedicalForm.findByIdAndUpdate(id, { formDetails }, { new: true });
    res.status(200).json({ message: 'Medical form updated successfully', medicalForm });
  } catch (error) {
    console.error('Error updating medical form:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Delete a medical form
exports.deleteMedicalForm = async (req, res) => {
  try {
    const { id } = req.params;

    const medicalForm = await MedicalForm.findByIdAndDelete(id);
    if (!medicalForm) {
      return res.status(404).json({ message: 'Medical form not found' });
    }

    res.status(200).json({ message: 'Medical form deleted successfully' });
  } catch (error) {
    console.error('Error deleting medical form:', error.message);
    res.status(500).json({ error: error.message });
  }
};
