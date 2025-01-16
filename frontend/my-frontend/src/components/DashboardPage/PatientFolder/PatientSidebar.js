import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css"; // Sidebar-specific CSS file
import logo from "../../Images/logo.svg";
import logoutIcon from "../../Images/Logout.svg";
import requests from "../../Images/requests.svg";
import listIcon from "../../Images/List.svg";

const Sidebar = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Navigation handlers
  const handleRequestsNavigation = () => {
    navigate("/DoctorDashboard"); // Navigate to DoctorDashboard default route
  };

  const handleConfirmedPatientsNavigation = () => {
    navigate("/DoctorDashboard/ConfirmedPatients"); // Navigate to ConfirmedPatients
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
onClick={handleRequestsNavigation}
          >
            <img src={requests} alt="Requests" className="menu-icon" />
          </button>
          <button
            className="menu-item"
<<<<<<< Updated upstream
            onClick={handleConfirmedPatientsNavigation}
=======
            onClick={handleViewNavigation}
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
export default Sidebar;
=======
export default PatientSidebar;
>>>>>>> Stashed changes
export default Sidebar;
