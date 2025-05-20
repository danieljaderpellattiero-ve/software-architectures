import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminSidebar.css"; // Sidebar-specific CSS file
import logo from "../../../Images/logo.svg";
import logoutIcon from "../../../Images/Logout.svg";
import ManageUsers from "../../../Images/ManageUsers.svg";
import logsIcon from "../../../Images/logs.svg";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Navigation handlers
  const handleLogsNavigation = () => {
    navigate("/AdminDashboard"); // Navigate to DoctorDashboard default route
  };

  const handleUsersListNavigation = () => {
    navigate("/AdminDashboard/LogsList"); // Navigate to ConfirmedPatients
  };

  return (
    <div className="adminSidebar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="menu-items">
        <div className="top-menu">
          <button className="menu-item" onClick={handleLogsNavigation}>
            <img src={ManageUsers} alt="ManageUsers" className="manage-icon" />
          </button>
          <button
            className="menu-item"
            onClick={handleUsersListNavigation}
          >
            <img src={logsIcon} alt="logs" className="menu-icon" />
          </button>
        </div>
        <div className="bottom-menu">
          <button className="menu-item">
            <img src={logoutIcon} alt="Logout" className="menu-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
