import React, { useState } from 'react';
import qrCodes from './qrCodes.json'; // Import your QR code data
import './TwoFactorAuth.css'; // Import your CSS file

const TwoFactorAuth = ({ closeModal }) => {
  const [authCode, setAuthCode] = useState("");

  const handleInputChange = (e) => {
    setAuthCode(e.target.value);
  };

  const handleSubmit = () => {
    console.log("Auth code submitted:", authCode);
    // Add your authentication logic here

    // Close the modal after submission (optional)
    closeModal();
  };

  return (
    <div className="two-factor-auth-overlay">
      <div className="two-factor-auth-container">
        <h2>Two Factor Authentication</h2>
        
        <div className="qr-code-container">
          {qrCodes.map((qrCode) => (
            <div key={qrCode.id} className="qr-code-item">
              <img src={qrCode.qrCodeUrl} alt={qrCode.label} />
            </div>
            
          ))}
        </div>

        <div className="auth-code-input">
        <p className="message">Enter the 6-digit code from Google Auth app</p>

          <input
            type="text"
            value={authCode}
            onChange={handleInputChange}
            placeholder="Enter 6-digit code"
        />

        <div className='button-container'>
          <button className='authenticate-button' onClick={handleSubmit}>Authenticate</button>
          <button className="cancel-button" onClick={closeModal}>Cancel</button> {/* Add Cancel button */}
        </div>
          
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
