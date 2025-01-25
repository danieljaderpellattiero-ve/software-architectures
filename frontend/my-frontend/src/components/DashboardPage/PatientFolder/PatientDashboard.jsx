// src/pages/PatientDashboard.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import "./PatientDashboard.css";
import PatientSidebar from "./PatientSidebar";
import PatientProfile from "./PatientProfile";
import BookAppointment from "./BookAppointment";

function PatientDashboard() {
  return (
    <div className="dashboard-container">
      <PatientSidebar />
      <div className="dashboard-main-content">
        <Routes>
          {/* Default route */}
          <Route index element={<PatientProfile />} />
          {/* DoctorSelect route */}
          <Route path="BookAppointment" element={<BookAppointment />} />
        </Routes>
      </div>
    </div>
  );
}

export default PatientDashboard;
