// src/pages/AdminDashboard.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Route, Routes, Outlet } from "react-router-dom";
import Sidebar from "./AdminFolder/Sidebar";

function AdminDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  // Если текущий пользователь не админ, перенаправляем его на страницу входа
  if (!currentUser || currentUser.role !== "admin") {
    navigate("/login");
    return null; // Чтобы не рендерить компонент, если пользователь не админ
  }

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="content">
        <h2>Welcome to Admin Dashboard</h2>
      </div>
    </div>
  );
}

export default AdminDashboard;
