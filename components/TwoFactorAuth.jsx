'use client';
import React, { useState } from "react";
// import qrCodes from "./qrCodes.json";

const TwoFactorAuth = ({ closeModal, onSuccess }) => {
  const [authCode, setAuthCode] = useState("");

  const handleInputChange = (e) => {
    setAuthCode(e.target.value);
  };

  const handleSubmit = () => {
    // Add your authentication logic here
    console.log("Auth code submitted:", authCode);

    // Simulate successful authentication
    if (authCode === "000000") {
      onSuccess(); // Redirect based on user role
      closeModal();
    } else {
      alert("Invalid authentication code");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-1000">
      <div className="bg-white p-5 gap-5 rounded-md w-80 shadow-md flex flex-col items-center">
        <h2 className="text-xl font-semibold">Two Factor Authentication</h2>

        <div className="flex flex-col gap-2 mb-5">
          {qrCodes.map((qrCode) => (
            <div key={qrCode.id} className="mb-4">
              <img src={qrCode.qrCodeUrl} alt={qrCode.label} className="w-52 h-52" />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center w-full">
          <p className="text-sm text-purple-700 mt-2">Enter the 6-digit code from Google Auth app</p>
          <input
            type="text"
            value={authCode}
            onChange={handleInputChange}
            placeholder="Enter 6-digit code"
            className="border p-2 mb-3 w-full rounded-md"
          />

          <div className="flex gap-2 w-full px-5 justify-between items-center">
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
              onClick={handleSubmit}
            >
              Authenticate
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;