import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ email, password, firstName, lastName, role: "patient" });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created!");
  };

  return (
    <div className="register-container">
      <main>
        <h1>Register Now!</h1>
        <form onSubmit={handleRegister}>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
          />
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your last name"
          />
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <label>Phone Number</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your phone number"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          {/* <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          /> */}
          <input type="submit" value="Register" />
        </form>
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </main>
    </div>
  );
}

export default RegisterPage;
