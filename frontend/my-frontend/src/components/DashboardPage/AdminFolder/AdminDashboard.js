// src/pages/AdminDashboard.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Route, Routes, Outlet } from "react-router-dom";
import ManageDoctors from "./ManageDoctors";
import AdminLayout from "./AdminLayout";
import DashboardHome from "./DashboardHome";

function AdminDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  // Если текущий пользователь не админ, перенаправляем его на страницу входа
  if (!currentUser || currentUser.role !== "admin") {
    navigate("/");
    return null; // Чтобы не рендерить компонент, если пользователь не админ
  }

  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>

        <Route index element={<DashboardHome />} />

        <Route path="manage-doctors" element={<ManageDoctors />} />
        {/* <Route path="manage-nurses" element={<ManageNurses />} /> */}
        {/* <Route path="manage-patients" element={<ManagePatients />} /> */}
        {/* <Route path="logs" element={<SystemLogs />} /> */}
      </Route>
    </Routes>
  );
}

export default AdminDashboard;
