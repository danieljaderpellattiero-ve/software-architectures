import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css"; 


function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li>
          <Link to="/admin">Dashboard Home</Link>
        </li>
        <li>
          <Link to="/admin/manage-doctors">Manage Doctors</Link>
        </li>
        {/* <li>
          <Link to="/admin/manage-nurses">Manage Nurses</Link>
        </li> */}
        {/* <li>
          <Link to="/admin/manage-patients">Manage Patients</Link>
        </li> */}
        {/* <li>
          <Link to="/admin/logs">View Logs</Link>
        </li> */}
        <li>
        <button onClick={handleLogout}>Log Out</button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
