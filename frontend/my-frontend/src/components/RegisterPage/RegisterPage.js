import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

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

  // From step 1 to step 2 
  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  }

  // From step 2 back to step 1
  const handlePrev = () => {
    setStep(1);
  }

  // Registration 
  const handleRegister = (e) => {
    e.preventDefault();

    // Collecting all data to one object
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

    // saving on localStorage 
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created!");
    navigate("/");
  };

  return (
    <div className="register-container">
      <main>
        <h1>Register Now!</h1>

        {/* Step 1 */}
        {step === 1 && (
        <form onSubmit={handleNext}>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
            required
          />
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your last name"
            required
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
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            required
          />
          <label>codice Fiscale</label>
          <input
            type="number"
            value={codiceFiscale}
            onChange={(e) => setCodiceFiscale(e.target.value)}
            placeholder="Enter your Codice Fiscale"
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <input type="submit" value="Continue" />
        </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
        <form onSubmit={handleRegister}>
          <label>Blood type</label>
          <input
            type="text"
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            placeholder="Enter your Blood type"
          />
          <label>Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter your height"
          />
          <label>Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter your weight"
          />
          <label>Current Address</label>
          <input
            type="text"
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
            placeholder="Enter your current address"
          />

          {/* Back to step 1*/}
          <button type="button" onClick={handlePrev}>
            Back
          </button>
          
          <input type="submit" value="Register" />
        </form>
        )}

        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </main>
    </div>
  );
}

export default RegisterPage;
