import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../Images/logo.svg";
import logoutIcon from "../../../Images/Logout.svg";
import Profile from "../../../Images/Profile.svg";
import SelectDoctor from "../../../Images/SelectOption.svg";
import "./PatientSidebar.css";



const PatientSidebar = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Navigation handlers
  const handleProfileNavigation = () => {
    navigate("/PatientDashboard"); // Navigate to DoctorDashboard default route
  };

  const handleDoctorSelectNavigation = () => {
    navigate("/PatientDashboard/BookAppointment"); // Navigate to ConfirmedPatients
  };

  return (
    <div className="adminSidebar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="menu-items">
        <div className="top-menu">
          <button className="menu-item" onClick={handleProfileNavigation}>
            <img src={Profile} alt="ManageUsers" className="manage-icon" />
          </button>
          <button
            className="menu-item"
            onClick={handleDoctorSelectNavigation}
          >
            <img src={SelectDoctor} alt="SelectOption" className="menu-icon" />
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
