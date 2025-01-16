import React, { useState } from 'react';
import './PatientUpdate.css';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    firstName: 'John',
    surname: 'Doe',
    nationalCode: '',
    phoneNumber: '',
    countryCode: '+98',
    dateOfBirth: '',
    country: '',
    educationLevel: '',
    city: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-icon">👤</div>
        <div className="sidebar-icon">⊞</div>
        <div className="sidebar-icon">⚙</div>
        <div className="sidebar-icon bottom">⊷</div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="profile-card">
          {/* Header */}
          <div className="profile-header">
            <h1>Profile</h1>
            <div className="user-menu">
              <div className="avatar-small"></div>
              <span>▼</span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="profile-info">
            <div className="avatar-large">
              <span>👤</span>
            </div>
            <h2>John Doe</h2>
            <p>Your account is ready, you can now request an appointment from appointments page.</p>
          </div>

          {/* Form */}
          <div className="form-container">
            <div className="form-columns">
              {/* Personal Information */}
              <div className="form-column">
                <h3>Personal</h3>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>National Code</label>
                  <input
                    type="text"
                    name="nationalCode"
                    value={formData.nationalCode}
                    onChange={handleInputChange}
                    placeholder="Enter value"
                  />
                </div>
                <div className="form-group">
                  <label>Date of birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Education level</label>
                  <input
                    type="text"
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleInputChange}
                    placeholder="Select"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="form-column">
                <h3>Contact</h3>
                <div className="form-group">
                  <label>Surname</label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="phone-input">
                    <input
                      type="text"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="country-code"
                    />
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="912000000"
                      className="phone-number"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Select"
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter value"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="button-container">
              <button className="primary-button">Fill Medical Records</button>
              <button className="primary-button">Upload Extra Medical Files</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;