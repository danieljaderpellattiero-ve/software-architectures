'use client'
import React, { useState, useEffect } from "react";
import profile from "@/public/Profile.svg";
import Cookies from 'js-cookie';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PatientProfile = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    nationalCode: '',
    dateOfBirth: '',
    educationLevel: '',
    email: '',
    phoneNumber: '',
    country: '',
    city: ''
  });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  // 2FA states
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState(null);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  // PDF Upload State
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [uploadPdfError, setUploadPdfError] = useState(null);
  const [uploadPdfSuccess, setUploadPdfSuccess] = useState(null);
  // Analyzed Medical Data State
  const [analyzedMedicalData, setAnalyzedMedicalData] = useState(null);

  useEffect(() => {
    fetchPatientData();
  }, [user]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      setAnalyzedMedicalData(null); // Clear previous data while fetching

      const response = await fetch('/api/patient/profile');
      const data = await response.json();
      
      console.log('Frontend PatientProfile fetchPatientData: Raw data object from API:', data);

      console.log('Frontend PatientProfile fetchPatientData: Data received from API:', data);
      console.log('Frontend PatientProfile fetchPatientData: analyzedPdfData received:', data?.analyzedPdfData);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch patient data');
      }
      
      // Store fetched analyzed data
      setAnalyzedMedicalData({
        analyzedPdfData: data.analyzedPdfData || null,
        uploadedPdfBase64: data.uploadedPdfBase64 || null,
      });
      
      // Format the date if it exists
      if (data.dateOfBirth) {
        const date = new Date(data.dateOfBirth);
        if (!isNaN(date.getTime())) {
          data.dateOfBirth = date.toISOString().split('T')[0];
        }
      }
      
      setFormData(data);
      setTwoFactorEnabled(data.twoFactorEnabled || false);
      console.log('Frontend PatientProfile: formData state after setting:', data);
      console.log('Frontend PatientProfile: Country value in formData after setting:', data.country);
      setOriginalData(data); // Store original data for cancel functionality
    } catch (err) {
      console.error('Frontend PatientProfile: Error fetching data:', err);
      setError(err.message || 'Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditable(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCancel = () => {
    setFormData(originalData); // Restore original data
    setIsEditable(false);
    setError(null);
    setSuccessMessage(null);
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.surname.trim()) {
      setError('Surname is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    try {
      setError(null);
      setSuccessMessage(null);

      if (!validateForm()) {
        return;
      }

      // Capture the current form data before the async operation
      const dataToSave = { ...formData };
      
      // Ensure date is in the correct format for the API
      if (dataToSave.dateOfBirth) {
        const date = new Date(dataToSave.dateOfBirth);
        if (!isNaN(date.getTime())) {
          dataToSave.dateOfBirth = date.toISOString();
        }
      }
      
      console.log('Frontend PatientProfile: Sending data to API:', dataToSave);
      console.log('Frontend PatientProfile: Country value being sent to API:', dataToSave.country);

      const response = await fetch('/api/patient/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      const responseData = await response.json(); // Get response data
      console.log('Frontend PatientProfile: Response data from PUT:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update patient data');
      }

      // Optimistically update state with the data that was successfully sent
      setFormData(dataToSave);
      setOriginalData(dataToSave);
      setSuccessMessage('Profile updated successfully!');
      setIsEditable(false);
      
      // Optionally, you can still refetch in the background to ensure consistency,
      // but the immediate UI update comes from the optimistic state update.
      // setTimeout(() => { fetchPatientData(); }, 1000); // Example: refetch after a delay

    } catch (err) {
      console.error('Error saving patient data:', err);
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSetup2FA = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch('/api/auth/setup-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to setup 2FA');
      }

      setQrCode(data.qrCode);
      setSecret(data.secret);
      setShow2FASetup(true);
    } catch (err) {
      setError(err.message || 'Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    try {
      setLoading(true);
      setError(null);
      setTwoFactorError(null);
      setSuccessMessage(null);

      const response = await fetch('/api/auth/setup-2fa', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setTwoFactorError(data.message || 'Failed to verify 2FA');
        return;
      }

      setSuccessMessage('2FA has been enabled successfully!');
      setShow2FASetup(false);
      setQrCode(null);
      setSecret(null);
      setVerificationCode('');
      setTwoFactorEnabled(true);
    } catch (err) {
      setTwoFactorError(err.message || 'An unexpected error occurred during 2FA verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch('/api/auth/setup-2fa', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to disable 2FA');
      }

      setSuccessMessage('2FA has been disabled successfully!');
      setTwoFactorEnabled(false);
      setVerificationCode('');
    } catch (err) {
      setError(err.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch('/api/patient/delete-account', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      // Account deleted successfully, now log out the user
      await logout();
      
    } catch (err) {
      setError(err.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      setUploadPdfError('Please upload a PDF file.');
      setUploadPdfSuccess(null);
      return;
    }

    setIsUploadingPdf(true);
    setUploadPdfError(null);
    setUploadPdfSuccess(null);

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result.split(',')[1]; // Get base64 string after 'base64,'
      console.log('PDF file read as Base64.');

      try {
        // Send PDF to Python Flask server
        const flaskResponse = await fetch('http://localhost:8180/Gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pdf: base64String }),
        });

        const flaskData = await flaskResponse.json();

        if (!flaskResponse.ok) {
          throw new Error(flaskData.error || 'Error processing PDF on server.');
        }

        console.log('PDF processed by Flask server, response:', flaskData.response);

        // Send both the Base64 PDF and the analyzed result to the Next.js API endpoint
        const nextApiResponse = await fetch('/api/patient/profile/save-analyzed-data', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            base64Pdf: base64String, // Include the Base64 PDF string
            analyzedData: flaskData.response // Include the analyzed data
          }),
        });

        const nextApiData = await nextApiResponse.json();

        if (!nextApiResponse.ok) {
          throw new Error(nextApiData.error || 'Error saving analyzed data to profile.');
        }

        console.log('Analyzed data saved to profile:', nextApiData);
        
        // Re-fetch patient data to update the profile display
        await fetchPatientData();

        setUploadPdfSuccess('PDF uploaded and processed successfully! Analyzed data and PDF saved to profile.');

      } catch (error) {
        console.error('Error during PDF upload or processing:', error);
        setUploadPdfError(error.message || 'Failed to upload or process PDF.');
      } finally {
        setIsUploadingPdf(false);
      }
    };

    reader.onerror = () => {
      console.error('Error reading PDF file.');
      setIsUploadingPdf(false);
      setUploadPdfError('Error reading PDF file.');
      setUploadPdfSuccess(null);
    };

    reader.readAsDataURL(file);
  };

  const handleDownloadPdf = (base64) => {
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${base64}`;
    link.download = 'uploaded_medical_document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  console.log('Frontend PatientProfile: Rendering with formData:', formData);
  console.log('Frontend PatientProfile: Input values during render -');
  console.log('  dateOfBirth:', formData.dateOfBirth);
  console.log('  educationLevel:', formData.educationLevel);
  console.log('  country:', formData.country);
  console.log('  city:', formData.city);

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-5 text-gray-800">Profile</h1>
      
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-6 mb-8 items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden shadow-sm border-4 border-purple-500 flex items-center justify-center bg-gray-200">
          {formData.profileImage ? (
            <Image 
              src={formData.profileImage} 
              alt="Profile" 
              width={128}
              height={128}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Frontend PatientProfile: Error loading image');
                e.target.src = profile; // Fallback to original SVG if the saved image fails
              }}
            />
          ) : (
            <FaUser className="text-gray-500" size={80} />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-purple-700">{`${formData.firstName} ${formData.surname}`}</h2>
          <p className="text-gray-600">
            Your account is ready, you can now request an appointment from the appointments page.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-4 mb-4">
        {!isEditable ? (
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleEdit}
          >
            Edit
          </button>
        ) : (
          <>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSave}
            >
              Save
            </button>
          </>
        )}
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
            First Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleInputChange}
            readOnly={!isEditable}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
            Surname
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="surname"
            type="text"
            value={formData.surname}
            onChange={handleInputChange}
            readOnly={!isEditable}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nationalCode">
            National Code
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="nationalCode"
            type="text"
            value={formData.nationalCode}
            onChange={handleInputChange}
            readOnly={!isEditable}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateOfBirth">
            Date of Birth
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            readOnly={!isEditable}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="educationLevel">
            Education Level
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="educationLevel"
            value={formData.educationLevel}
            onChange={handleInputChange}
            disabled={!isEditable}
          >
            <option value="">Select</option>
            <option value="software">Software</option>
            <option value="engineering">Engineering</option>
            <option value="medicine">Medicine</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            readOnly={!isEditable}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
            Phone Number
          </label>
          <div className="flex">
            <select
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-20 mr-2"
              value={formData.phoneCode || '+98'}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneCode: e.target.value }))}
              disabled={!isEditable}
            >
              <option value="+98">+98</option>
              <option value="+1">+1</option>
            </select>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phoneNumber"
              type="text"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              readOnly={!isEditable}
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
            Country
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="country"
            value={formData.country}
            onChange={handleInputChange}
            disabled={!isEditable}
          >
            <option value="">Select</option>
            <option value="egypt">Egypt</option>
            <option value="italy">Italy</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
            City
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="city"
            type="text"
            value={formData.city}
            onChange={handleInputChange}
            readOnly={!isEditable}
          />
        </div>
        {/* Display Analyzed Medical Data beside/below City */}
        {analyzedMedicalData && ( 
          <div className="md:col-span-2 mt-4">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Analyzed Medical Data</h3>
            {/* Adjust rendering based on data structure */}
            <div className="prose max-w-none overflow-auto max-h-60 p-4 border rounded bg-gray-50">
              {analyzedMedicalData.analyzedPdfData ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{
                  // Ensure the data is a string before passing to ReactMarkdown
                  typeof analyzedMedicalData.analyzedPdfData === 'string' 
                    ? analyzedMedicalData.analyzedPdfData 
                    : JSON.stringify(analyzedMedicalData.analyzedPdfData, null, 2)
                }</ReactMarkdown>
              ) : (
                <p>No analyzed medical data available.</p>
              )}
            </div>
          </div>
        )}
        <div className="md:col-span-2 flex gap-4 mt-6">
        </div>
      </form>

      {/* PDF Upload Section */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Medical Documents (PDF)</h3>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            id="pdfUpload"
            accept=".pdf"
            className="hidden"
            onChange={handlePdfUpload}
          />
          <label
            htmlFor="pdfUpload"
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer ${isUploadingPdf ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploadingPdf ? 'Uploading...' : 'Upload PDF'}
          </label>
          {/* Download Button next to Upload */}
          {analyzedMedicalData?.uploadedPdfBase64 && (
            <button
              onClick={() => handleDownloadPdf(analyzedMedicalData.uploadedPdfBase64)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Download PDF
            </button>
          )}
        </div>
        {uploadPdfError && <p className="text-red-500 text-sm mt-2">{uploadPdfError}</p>}
        {uploadPdfSuccess && <p className="text-green-500 text-sm mt-2">{uploadPdfSuccess}</p>}
      </div>

      {/* 2FA Section */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Two-Factor Authentication</h3>
        
        {twoFactorEnabled ? (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-green-800">
                2FA is currently enabled for your account
              </p>
            </div>
            <div className="mt-4">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code to disable 2FA"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={6}
                pattern="[0-9]*"
                inputMode="numeric"
              />
            </div>
            <button
              onClick={handleDisable2FA}
              disabled={loading || verificationCode.length !== 6}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Disabling...' : 'Disable 2FA'}
            </button>
          </div>
        ) : (
          <div>
            {!show2FASetup ? (
              <button
                onClick={handleSetup2FA}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Setting up...' : 'Enable 2FA'}
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Scan this QR code with your authenticator app:
                </p>
                {qrCode && (
                  <div className="flex justify-center">
                    <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  Or enter this code manually: {secret}
                </p>
                <div className="mt-4">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    maxLength={6}
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                  {twoFactorError && <p className="text-red-500 text-sm mt-1">{twoFactorError}</p>}
                </div>
                <button
                  onClick={handleVerify2FA}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify and Enable 2FA'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h3>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Delete Account
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Warning: This action cannot be undone. All your data will be permanently deleted.
        </p>
      </div>
    </div>
  );
};

export default PatientProfile;