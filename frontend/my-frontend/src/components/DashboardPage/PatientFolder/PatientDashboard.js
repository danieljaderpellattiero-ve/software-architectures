
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Route, Routes, Outlet } from "react-router-dom";
import PatientLayout from "./PatientLayout";
import DashboardMain from "./DashboardMain";

function PatientDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  
  if (!currentUser || currentUser.role !== "patient") {
    navigate("/");
    return null; 
  }

  return (
    <Routes>
      <Route path="/" element={<PatientLayout />}>

        <Route index element={<DashboardMain />} />

        {/* <Route path="manage-doctors" element={<ManageDoctors />} /> */}
        {/* <Route path="manage-nurses" element={<ManageNurses />} /> */}
        {/* <Route path="manage-patients" element={<ManagePatients />} /> */}
        {/* <Route path="logs" element={<SystemLogs />} /> */}
      </Route>
    </Routes>
  );
}

