import React from "react";
import { Routes, Route } from "react-router-dom";
import "./PatientDashboard.css";
import PatientSidebar from "./PatientSidebar"; // Correct import
import UpdateForms from "./UpdateForms"; // Correct import
import ViewForms from "./ViewForms"; // Correct import
// import PatientRequests from "./PatientRequests";
// import ConfirmedPatients from "./ConfirmedPatients"; // Correct capitalization

function PatientDashboard() {
  return (
    <div className="dashboard-container">
      <PatientSidebar />
      <div className="main-content">
        <Routes>
          {/* Default route */}
          {/* <Route index element={<ViewForms />} /> */}
          <Route path="ViewForms" element={<ViewForms />} />
          
          {/* UpdateForms route */}
          <Route path="UpdateForms" element={<UpdateForms />} />

        </Routes>
      </div>
    </div>
  );
}

export default PatientDashboard;
