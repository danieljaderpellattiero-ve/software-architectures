import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // getting all users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // searching for user with the same email and password
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // saving current user to the localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));
      if (user.role === "admin") {
        navigate("/AdminDashboard");
      } else if (user.role === "doctor") {
        navigate("/DoctorDashboard");
      } else {
        navigate("/PatientDashboard");
      }
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div>
      <main>
        <form onSubmit={handleLogin}>
          <h3>Personal Information</h3>
          <label>Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <label>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <input type="submit" value="Login" />
        </form>
        <p>
          Don't have an account yet? <a href="/register">Register</a>
        </p>
      </main>
    </div>
  );
}

export default LoginPage;
