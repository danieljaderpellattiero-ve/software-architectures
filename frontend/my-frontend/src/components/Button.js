import React from "react";
import { useNavigate } from "react-router-dom";

function Button() {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.removeItem("user");

    navigate("/login");
  };

  return <button onClick={Click}></button>;
}

export default Button;
