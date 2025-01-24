import React, { useState } from 'react';
import PatientSidebar from './PatientSidebar';
import UpdateForms from './UpdateForms';
import './ViewForms.css';
import './PatientSidebar.css';

const ViewForms = () => {
  const [activeTab, setActiveTab] = useState('medical');
  const [medicalData, setMedicalData] = useState({
    chronic_conditions: '',
    allergies: '',
    medications: [],
    paternal_history: '',
    maternal_history: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateFormSave = (updatedData) => {
    setMedicalData(updatedData);
    setIsEditing(false);
  };

  const renderMedicalRecords = () => (
    <div className="records-container">
      <div className="records-header">
        <h3>Medical Records</h3>
        <button 
          className="edit-button" 
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      </div>
      <div className="record-grid">
        <div className="record-item">
          <div className="record-label">Chronic Conditions</div>
          <div className="record-value">
            {medicalData.chronic_conditions || 'Not specified'}
          </div>
        </div>
        <div className="record-item">
          <div className="record-label">Allergies</div>
          <div className="record-value">
            {medicalData.allergies || 'None'}
          </div>
        </div>
      </div>

      <h4>Current Medications</h4>
      {medicalData.medications.length > 0 ? (
        <table className="medications-table">
          <thead>
            <tr>
              <th>Medication</th>
              <th>Dosage</th>
            </tr>
          </thead>
          <tbody>
            {medicalData.medications.map((medication, index) => (
              <tr key={index}>
                <td>{medication.name || 'Unnamed'}</td>
                <td>{medication.dosage || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data">No medications recorded</p>
      )}
    </div>
  );

  const renderFamilyHistory = () => (
    <div className="records-container">
      <h3>Family Medical History</h3>
      <div className="record-grid">
        <div className="record-item">
          <div className="record-label">Paternal History</div>
          <div className="record-value">
            {medicalData.paternal_history || 'Not specified'}
          </div>
        </div>
        <div className="record-item">
          <div className="record-label">Maternal History</div>
          <div className="record-value">
            {medicalData.maternal_history || 'Not specified'}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="patient-dashboard">
      <PatientSidebar />
      <div className="view-forms-container">
        <div className="profile-card">
          <div className="profile-header">
            <h1>My Medical Information</h1>
          </div>
          
          <div className="form-navigation">
            <button 
              className={`nav-button ${activeTab === 'medical' ? 'active' : ''}`}
              onClick={() => setActiveTab('medical')}
            >
              Medical Records
            </button>
            <button 
              className={`nav-button ${activeTab === 'family' ? 'active' : ''}`}
              onClick={() => setActiveTab('family')}
            >
              Family History
            </button>
          </div>

          {isEditing ? (
            <UpdateForms 
              onSave={handleUpdateFormSave}
              initialData={medicalData}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            activeTab === 'medical' 
              ? renderMedicalRecords() 
              : renderFamilyHistory()
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewForms;