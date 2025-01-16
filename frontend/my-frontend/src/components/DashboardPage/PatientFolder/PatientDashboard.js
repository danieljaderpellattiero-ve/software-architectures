
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Route, Routes, Outlet } from "react-router-dom";
import PatientSidebar from "./PatientSidebar";

function PatientDashboard() {
  return (
    <div className="dashboard-container">
      <PatientSidebar />
      <div className="main-content">

      </div>
    </div>
  );
}

export default PatientDashboard;