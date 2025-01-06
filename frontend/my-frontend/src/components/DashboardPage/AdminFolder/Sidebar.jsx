// src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faChartLine,
  faUser,
  faCalendarAlt,
  faClipboardList,
  faShieldAlt,
  faQuestionCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <Link to="/AdminDashboard" className="menu-item">
            <FontAwesomeIcon icon={faHome} className="icon" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/ManagePatients" className="menu-item">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <span>Patients</span>
          </Link>
        </li>
        <li>
          <Link to="/ManageEmployees" className="menu-item">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <span>Employees</span>
          </Link>
        </li>
        <li>
          <Link to="/ManageSchedule" className="menu-item">
            <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
            <span>Schedule</span>
          </Link>
        </li>
        <li>
          <Link to="/GenerateReports" className="menu-item">
            <FontAwesomeIcon icon={faClipboardList} className="icon" />
            <span>Reports</span>
          </Link>
        </li>
        <li>
          <Link to="/ManageAccess" className="menu-item">
            <FontAwesomeIcon icon={faShieldAlt} className="icon" />
            <span>Access Control</span>
          </Link>
        </li>
      </ul>
      <div className="sidebar-footer">
        <Link to="/help" className="menu-item">
          <FontAwesomeIcon icon={faQuestionCircle} className="icon" />
          <span>Help</span>
        </Link>
        <Link to="/logout" className="menu-item">
          <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
