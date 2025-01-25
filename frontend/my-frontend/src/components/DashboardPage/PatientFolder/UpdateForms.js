import React, { useState } from 'react';
import './UpdateForms.css';

const UpdateForms = ({ onSave = () => {}, initialData = {}, isLoading = false }) => {
  const [formData, setFormData] = useState({
    chronicConditions: initialData.chronic_conditions || '',
    allergies: initialData.allergies || '',
    medications: initialData.medications?.length
      ? initialData.medications
      : [{ name: '', dosage: '' }],
    paternalHistory: initialData.paternal_history || '',
    maternalHistory: initialData.maternal_history || '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.chronicConditions.trim()) {
      newErrors.chronicConditions = 'Chronic conditions are required.';
    }
    if (!formData.paternalHistory.trim()) {
      newErrors.paternalHistory = 'Paternal history is required.';
    }
    if (!formData.maternalHistory.trim()) {
      newErrors.maternalHistory = 'Maternal history is required.';
    }

    const invalidMedications = formData.medications.some(
      (med) => !med.name.trim() || !med.dosage.trim()
    );
    if (invalidMedications) {
      newErrors.medications = 'All medication fields must be completed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      medications: updatedMedications,
    }));

    if (errors.medications) {
      setErrors((prev) => ({ ...prev, medications: undefined }));
    }
  };

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '' }],
    }));
  };

  const removeMedication = (index) => {
    const updatedMedications = formData.medications.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      medications: updatedMedications.length ? updatedMedications : [{ name: '', dosage: '' }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSave({
          chronic_conditions: formData.chronicConditions,
          allergies: formData.allergies,
          medications: formData.medications,
          paternal_history: formData.paternalHistory,
          maternal_history: formData.maternalHistory,
        });
      } catch (error) {
        console.error('Save failed:', error);
      }
    }
  };

  return (
    <div className="medical-form-container">
      <div className="medical-form">
        <h1>Update Medical Information</h1>

        <div className="form-section">
          <label htmlFor="chronicConditions">Chronic Conditions</label>
          <input
            id="chronicConditions"
            name="chronicConditions"
            value={formData.chronicConditions}
            onChange={handleInputChange}
            className={errors.chronicConditions ? 'input-error' : ''}
            disabled={isLoading}
          />
          {errors.chronicConditions && (
            <p className="error-message">{errors.chronicConditions}</p>
          )}
        </div>

        <div className="form-section">
          <label htmlFor="allergies">Allergies</label>
          <input
            id="allergies"
            name="allergies"
            value={formData.allergies}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        <div className="form-section medications-section">
          <h2>Medications</h2>
          {formData.medications.map((medication, index) => (
            <div key={index} className="medication-row">
              <input
                type="text"
                placeholder="Medication Name"
                value={medication.name}
                onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                disabled={isLoading}
              />
              <input
                type="text"
                placeholder="Dosage"
                value={medication.dosage}
                onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                disabled={isLoading}
              />
              {formData.medications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="remove-btn"
                  disabled={isLoading}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {errors.medications && <p className="error-message">{errors.medications}</p>}
          <button 
            type="button" 
            onClick={addMedication} 
            className="add-medication-btn"
            disabled={isLoading}
          >
            Add Medication
          </button>
        </div>

        <div className="form-section">
          <label htmlFor="paternalHistory">Paternal History</label>
          <input
            id="paternalHistory"
            name="paternalHistory"
            value={formData.paternalHistory}
            onChange={handleInputChange}
            className={errors.paternalHistory ? 'input-error' : ''}
            disabled={isLoading}
          />
          {errors.paternalHistory && (
            <p className="error-message">{errors.paternalHistory}</p>
          )}
        </div>

        <div className="form-section">
          <label htmlFor="maternalHistory">Maternal History</label>
          <input
            id="maternalHistory"
            name="maternalHistory"
            value={formData.maternalHistory}
            onChange={handleInputChange}
            className={errors.maternalHistory ? 'input-error' : ''}
            disabled={isLoading}
          />
          {errors.maternalHistory && (
            <p className="error-message">{errors.maternalHistory}</p>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            onClick={handleSubmit} 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Medical Information'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateForms;