import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // For step 1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [codiceFiscale, setCodiceFiscale] = useState("");

  // For step 2
  const [homeAddress, setHomeAddress] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePrev = () => {
    setStep(1);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const newUser = {
      firstName,
      lastName,
      phoneNumber,
      email,
      codiceFiscale,
      password,
      homeAddress,
      role: "patient",
      medicalData: {
        height,
        weight,
        bloodType,
      },
    };
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created!");
    navigate("/");
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Register Now!</h1>

        {/* Step 1 */}
        {step === 1 && (
          <form className="register-form" onSubmit={handleNext}>
            <label className="register-label">First Name</label>
            <input
              type="text"
              className="register-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
            <label className="register-label">Last Name</label>
            <input
              type="text"
              className="register-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
            <label className="register-label">Email Address</label>
            <input
              type="email"
              className="register-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <label className="register-label">Phone Number</label>
            <input
              type="tel"
              className="register-input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
            <label className="register-label">Codice Fiscale</label>
            <input
              type="number"
              className="register-input"
              value={codiceFiscale}
              onChange={(e) => setCodiceFiscale(e.target.value)}
              placeholder="Enter your Codice Fiscale"
              required
            />
            <label className="register-label">Password</label>
            <input
              type="password"
              className="register-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            <input type="submit" className="register-submit" value="Continue" />
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form className="register-form" onSubmit={handleRegister}>
            <label className="register-label">Blood Type</label>
            <input
              type="text"
              className="register-input"
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              placeholder="Enter your Blood Type"
            />
            <label className="register-label">Height (cm)</label>
            <input
              type="number"
              className="register-input"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter your height"
            />
            <label className="register-label">Weight (kg)</label>
            <input
              type="number"
              className="register-input"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
            />
            <label className="register-label">Current Address</label>
            <input
              type="text"
              className="register-input"
              value={homeAddress}
              onChange={(e) => setHomeAddress(e.target.value)}
              placeholder="Enter your current address"
            />
            <button type="button" className="register-back" onClick={handlePrev}>
              Back
            </button>
            <input type="submit" className="register-submit" value="Register" />
          </form>
        )}

        <p className="register-footer">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
