import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import TwoFactorAuth from "./TwoFactorAuth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Store current user
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      setCurrentUser(user); // Store the logged-in user
      setShow2FAModal(true); // Show the 2FA modal
    } else {
      alert("Invalid email or password");
    }
  };

  const handle2FASuccess = () => {
    if (currentUser.role === "admin") {
      navigate("/AdminDashboard");
    } else if (currentUser.role === "doctor") {
      navigate("/DoctorDashboard");
    } else {
      navigate("/PatientDashboard");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h3 className="login-title">Personal Information</h3>
        <form className="login-form" onSubmit={handleLogin}>
          <label className="login-label">Email Address</label>
          <input
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <label className="login-label">Password</label>
          <input
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <input type="submit" className="login-submit" value="Login" />
        </form>
        <p className="login-footer">
          Don't have an account yet? <Link to="/register">Register</Link>
        </p>
      </div>

      {show2FAModal && (
        <TwoFactorAuth
          closeModal={() => setShow2FAModal(false)}
          onSuccess={handle2FASuccess}
        />
      )}
    </div>
  );
}

export default LoginPage;
