  import React from "react";
  import { Routes, Route } from "react-router-dom";
  import "./DoctorDashboard.css";
  import Sidebar from "./Sidebar";
  import PatientRequests from "./PatientRequests";
  import ConfirmedPatients from "./ConfirmedPatients"; // Correct capitalization

  function DoctorDashboard() {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            {/* Default route */}
            <Route index element={<PatientRequests />} />
            {/* ConfirmedPatients route */}
            <Route path="ConfirmedPatients" element={<ConfirmedPatients />} />
          </Routes>
        </div>
      </div>
    );
  }

  export default DoctorDashboard;
