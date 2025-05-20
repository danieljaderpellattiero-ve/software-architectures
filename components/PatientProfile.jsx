'use client'
import React, { useState, useEffect } from "react";
import profile from "@/public/Profile.svg";
import Cookies from 'js-cookie';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { FaUser } from 'react-icons/fa';

const PatientProfile = () => {
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

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch('/api/patient/profile');
      const data = await response.json();
      
      console.log('Frontend PatientProfile: Data received from API for state update:', data);
      console.log('Frontend PatientProfile: Country value from API:', data.country);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch patient data');
      }
      
      // Format the date if it exists
      if (data.dateOfBirth) {
        const date = new Date(data.dateOfBirth);
        if (!isNaN(date.getTime())) {
          data.dateOfBirth = date.toISOString().split('T')[0];
        }
      }
      
      setFormData(data);
      console.log('Frontend PatientProfile: formData state after setting:', data);
      console.log('Frontend PatientProfile: Country value in formData after setting:', data.country);
      setOriginalData(data); // Store original data for cancel functionality
    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError(err.message || 'An error occurred while fetching patient data');
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
        <div className="md:col-span-2 flex gap-4 mt-6">
          <button
            type="button"
            className="bg-purple-600 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!isEditable}
          >
            Fill Medical Records
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!isEditable}
          >
            Upload Extra Medical Files
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientProfile;