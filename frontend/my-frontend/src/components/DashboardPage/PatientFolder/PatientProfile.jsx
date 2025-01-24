import React from "react";
import profile from "../../../Images/Profile.svg";
import "./PatientProfile.css";

const PatientProfile = () => {
  return (
    <div className="patient-main-content">
      <h1 className="pageTitle">Profile</h1>
      <div className="profileHero">
        <div className="profileHero_left">
          <img src={profile} className="profileImage" alt="profile" />
        </div>
        <div className="profileHero_right">
          <span className="userName">John Doe</span>
          <span className="welcomeMessage">
            Your account is ready, you can now request an appointment from the appointments page.
          </span>
        </div>
      </div>
      <form className="profileForm">
        <div className="formContainer">
          {/* Left Side */}
          <div className="formColumn">
            <div className="formRow">
              <div className="formSection">
                <label>First Name</label>
                <input type="text" placeholder="Enter Value" />
              </div>
              <div className="formSection">
                <label>Surname</label>
                <input type="text" placeholder="Enter Value" />
              </div>
            </div>
            <div className="formSection">
              <label>National Code</label>
              <input type="text" placeholder="Enter Value" />
            </div>
            <div className="formSection">
              <label>Date of Birth</label>
              <input type="date" />
            </div>
            <div className="formSection">
              <label>Education Level</label>
              <select>
                <option value="">Select</option>
                <option value="software">Software</option>
                <option value="engineering">Engineering</option>
                <option value="medicine">Medicine</option>
              </select>
            </div>
          </div>
          {/* Right Side */}
          <div className="formColumn">
            <div className="formSection">
              <label>Email</label>
              <input type="email" placeholder="Enter Value" />
            </div>
            <div className="formSection">
              <label>Phone Number</label>
              <div className="phoneInput">
                <select>
                  <option value="+98">+98</option>
                  <option value="+1">+1</option>
                </select>
                <input type="text" placeholder="9120000000" />
              </div>
            </div>
            <div className="formSection">
              <label>Country</label>
              <select>
                <option value="">Select</option>
                <option value="egypt">Egypt</option>
                <option value="italy">Italy</option>
              </select>
            </div>
            <div className="formSection">
              <label>City</label>
              <input type="text" placeholder="Enter Value" />
            </div>
          </div>
        </div>
        <div className="formActions">
          <button className="primaryButton">Fill Medical Records</button>
          <button className="secondaryButton">Upload Extra Medical Files</button>
        </div>
      </form>
    </div>
  );
};

export default PatientProfile;
