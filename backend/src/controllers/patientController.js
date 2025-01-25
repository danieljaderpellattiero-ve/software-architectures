const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor'); // Assuming you have a Doctor model
const MedicalForm = require('../models/MedicalForm'); // Assuming you have a MedicalForm model

// Создание пациента
exports.createPatient = async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    res.status(201).json({ message: 'Patient created successfully', patient: newPatient });
  } catch (error) {
    console.error('Error creating patient:', error.message);
    res.status(500).json({ error: error.message });
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

// Send request to associate with a doctor
exports.sendRequestToDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const patientId = req.user.id;

    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Logic to send request to doctor
    // For example, you can add the patient ID to the doctor's pending requests
    doctor.pendingRequests.push(patientId);
    await doctor.save();

    res.status(200).json({ message: 'Request sent successfully' });
  } catch (error) {
    console.error('Error sending request:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Ensure patients can fill out forms
exports.fillForm = async (req, res) => {
  try {
    const { patientId, formData } = req.body;

    if (!patientId || !formData) {
      return res.status(400).json({ message: 'Patient ID and form data are required' });
    }

    const form = new MedicalForm({
      patient: patientId,
      formData,
      createdBy: req.user.id,
    });

    await form.save();
    res.status(201).json({ message: 'Form filled successfully', form });
  } catch (error) {
    console.error('Error filling form:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Ensure patients can edit/update forms
exports.updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { formData } = req.body;

    const form = await MedicalForm.findOneAndUpdate(
      { _id: id, patient: req.user.id },
      { formData, updatedAt: Date.now() },
      { new: true }
    );

    if (!form) {
      return res.status(404).json({ message: 'Form not found or unauthorized' });
    }

    res.status(200).json({ message: 'Form updated successfully', form });
  } catch (error) {
    console.error('Error updating form:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Ensure patients can view filled forms
exports.viewForms = async (req, res) => {
  try {
    const forms = await MedicalForm.find({ patient: req.user.id });
    res.status(200).json({ message: 'Forms retrieved successfully', forms });
  } catch (error) {
    console.error('Error viewing forms:', error.message);
    res.status(500).json({ error: error.message });
  }
};
