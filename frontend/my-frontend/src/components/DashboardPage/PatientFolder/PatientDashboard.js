<<<<<<< Updated upstream

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Route, Routes, Outlet } from "react-router-dom";
import PatientSidebar from "./PatientSidebar";
=======
import React from "react";
import { Routes, Route } from "react-router-dom";
import "./PatientDashboard.css";
import PatientSidebar from "./PatientSidebar"; // Correct import
import UpdateForms from "./UpdateForms"; // Correct import
import ViewForms from "./ViewForms"; // Correct import
// import PatientRequests from "./PatientRequests";
// import ConfirmedPatients from "./ConfirmedPatients"; // Correct capitalization
>>>>>>> Stashed changes

function PatientDashboard() {
  return (
    <div className="dashboard-container">
      <PatientSidebar />
      <div className="main-content">
<<<<<<< Updated upstream

=======
        <Routes>
          {/* Default route */}
          <Route index element={<UpdateForms />} />
          {/* ConfirmedPatients route */}
          <Route path="ViewForms" element={<ViewForms />} />
        </Routes>
>>>>>>> Stashed changes
      </div>
    </div>
  );
}

<<<<<<< Updated upstream
export default PatientDashboard;
=======
export default PatientDashboard;
>>>>>>> Stashed changes
