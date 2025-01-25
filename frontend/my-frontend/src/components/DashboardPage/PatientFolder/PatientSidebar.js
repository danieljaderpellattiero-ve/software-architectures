import React from "react";
import { useNavigate } from "react-router-dom";
import "./PatientSidebar.css"; // Sidebar-specific CSS file
import logo from "../../../Images/logo.svg";
import logoutIcon from "../../../Images/Logout.svg";
import requests from "../../../Images/requests.svg";
import listIcon from "../../../Images/List.svg";

const PatientSidebar = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Navigation handlers
  const handleViewNavigation = () => {
    navigate("/PatientDashboard/ViewForms"); // Navigate to DoctorDashboard default route
  };

  const handleUpdateNavigation = () => {
    navigate("/PatientDashboard/UpdateForms"); // Navigate to Update
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="menu-items">
        <div className="top-menu">
          <button
            className="menu-item"
            onClick={handleUpdateNavigation}
          >
            <img src={requests} alt="Requests" className="menu-icon" />
          </button>
          <button
            className="menu-item"
            onClick={handleViewNavigation}
          >
            <img src={listIcon} alt="Confirmed Patients" className="menu-icon" />
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

export default PatientSidebar;
