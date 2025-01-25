import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      {/* render content of current page via <Outlet /> */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
