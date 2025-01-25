// src/pages/AdminDashboard.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Route, Routes, Outlet } from "react-router-dom";
<<<<<<<< HEAD:frontend/my-frontend/src/components/DashboardPage/AdminFolder/AdminDashboard.jsx
import AdminSidebar from "./AdminSidebar";
import UsersList from "./UsersList";
import "./AdminDashboard.css";
import LogsList from "./LogsList";
========
import ManageDoctors from "./ManageDoctors";
import AdminLayout from "./AdminLayout";
import DashboardHome from "./DashboardHome";
>>>>>>>> 237172b083080fd21c4a7626ba8ef4674dd2135f:frontend/my-frontend/src/components/DashboardPage/AdminFolder/AdminDashboard.js

function AdminDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  // Если текущий пользователь не админ, перенаправляем его на страницу входа
  if (!currentUser || currentUser.role !== "admin") {
    navigate("/");
    return null; // Чтобы не рендерить компонент, если пользователь не админ
  }

  return (
<<<<<<<< HEAD:frontend/my-frontend/src/components/DashboardPage/AdminFolder/AdminDashboard.jsx
    <div className="adminDashboard-container">
      <AdminSidebar className="AdminSidebar" />
      <div className="admin-main-content">
      <Routes>
          <Route index element={<UsersList/>} />
          <Route path="LogsList" element={<LogsList/>} />
        </Routes>
      </div>
    </div>
========
    <Routes>
      <Route path="/" element={<AdminLayout />}>

        <Route index element={<DashboardHome />} />

        <Route path="manage-doctors" element={<ManageDoctors />} />
        {/* <Route path="manage-nurses" element={<ManageNurses />} /> */}
        {/* <Route path="manage-patients" element={<ManagePatients />} /> */}
        {/* <Route path="logs" element={<SystemLogs />} /> */}
      </Route>
    </Routes>
>>>>>>>> 237172b083080fd21c4a7626ba8ef4674dd2135f:frontend/my-frontend/src/components/DashboardPage/AdminFolder/AdminDashboard.js
  );
}

export default AdminDashboard;
