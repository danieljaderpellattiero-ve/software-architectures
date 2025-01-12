import React from "react";
import "./PatientList.css"; // Create this file for styles
import data from "../../Data/data.json"; // Import your JSON data

const PatientList = () => {
  return (
    <div className="patient-list">
      {data.map((patient) => (
        <div key={patient.id} className="patient-card">
          <div className="patient-info">
            <span className="patient-name">{patient.name}</span>
            <span className="patient-issue">Issue: {patient.issue}</span>
            <a href={patient.documentLink} className="document-link">
              View Documents
            </a>
          </div>
          <div className="patient-actions">
            <button className="action-btn confirm-btn">✔️</button>
            <button className="action-btn reject-btn">❌</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientList;
