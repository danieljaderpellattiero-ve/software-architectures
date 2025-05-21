'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (user?.twoFactorEnabled) {
      setShowSetup(false);
    }
  }, [user]);

  const handleSetup2FA = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch('/api/auth/setup-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to setup 2FA');
      }

      setQrCode(data.qrCode);
      setSecret(data.secret);
      setShowSetup(true);
    } catch (err) {
      setError(err.message || 'Failed to setup 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch('/api/auth/setup-2fa', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify 2FA');
      }

      setSuccess('2FA has been enabled successfully!');
      setShowSetup(false);
      setQrCode(null);
      setSecret(null);
      setVerificationCode('');
    } catch (err) {
      setError(err.message || 'Failed to verify 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Security Settings</h2>

          {/* 2FA Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Two-Factor Authentication</h3>
            
            {user?.twoFactorEnabled ? (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                <p className="text-green-800 dark:text-green-200">
                  2FA is currently enabled for your account
                </p>
              </div>
            ) : (
              <div>
                {!showSetup ? (
                  <button
                    onClick={handleSetup2FA}
                    disabled={isLoading}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Setting up...' : 'Enable 2FA'}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">
                      Scan this QR code with your authenticator app:
                    </p>
                    {qrCode && (
                      <div className="flex justify-center">
                        <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                      </div>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Or enter this code manually: {secret}
                    </p>
                    <div className="mt-4">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit code"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        maxLength={6}
                        pattern="[0-9]*"
                        inputMode="numeric"
                      />
                    </div>
                    <button
                      onClick={handleVerify2FA}
                      disabled={isLoading || verificationCode.length !== 6}
                      className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                      {isLoading ? 'Verifying...' : 'Verify and Enable 2FA'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-4 bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                <p className="text-green-800 dark:text-green-200">{success}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 