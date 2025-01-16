import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");

    navigate("/login");
  };

  return <button onClick={handleLogout}>Log Out</button>;
}

export default LogoutButton;
