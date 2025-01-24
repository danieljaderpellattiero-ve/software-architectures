// src/pages/AdminDashboard.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Route, Routes, Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import UsersList from "./UsersList";
import "./AdminDashboard.css";
import LogsList from "./LogsList";

function AdminDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  // Если текущий пользователь не админ, перенаправляем его на страницу входа
  if (!currentUser || currentUser.role !== "admin") {
    navigate("/login");
    return null; // Чтобы не рендерить компонент, если пользователь не админ
  }

  return (
    <div className="adminDashboard-container">
      <AdminSidebar className="AdminSidebar" />
      <div className="admin-main-content">
      <Routes>
          <Route index element={<UsersList/>} />
          <Route path="LogsList" element={<LogsList/>} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
