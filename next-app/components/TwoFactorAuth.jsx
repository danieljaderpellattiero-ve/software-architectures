'use client';
import React, { useState } from "react";
// import qrCodes from "./qrCodes.json";

const TwoFactorAuth = ({ email, tempToken, onVerifySuccess, onClose }) => {
  const [authCode, setAuthCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    console.log('TwoFactorAuth: Code input changed to:', value);
    setAuthCode(value);
    setError("");
  };

  const handleSubmit = async () => {
    console.log('TwoFactorAuth: Submitting code:', authCode);
    
    if (authCode.length !== 6) {
      console.log('TwoFactorAuth: Invalid code length:', authCode.length);
      setError("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log('TwoFactorAuth: Sending verification request with code:', authCode);
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: authCode,
          tempToken,
        }),
      });

      const data = await response.json();
      console.log('TwoFactorAuth: Verification response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      if (data.success) {
        console.log('TwoFactorAuth: Verification successful');
        onVerifySuccess();
      } else {
        console.log('TwoFactorAuth: Verification failed');
        setError('Invalid authentication code');
      }
    } catch (err) {
      console.error('TwoFactorAuth: Error during verification:', err);
      setError(err.message || 'Invalid authentication code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Two-Factor Authentication</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Please enter the 6-digit code from your authenticator app
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <input
              type="text"
              value={authCode}
              onChange={handleInputChange}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              maxLength={6}
              pattern="[0-9]*"
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || authCode.length !== 6}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isLoading || authCode.length !== 6
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;