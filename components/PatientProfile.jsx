'use client'
import React, { useState } from "react";
import profile from "@/public/Profile.svg";

const PatientProfile = () => {
  const [isEditable, setIsEditable] = useState(false);

  const handleEdit = () => {
    setIsEditable(true); // Enable edit mode
  };

  const handleSave = () => {
    setIsEditable(false); // Disable edit mode
    // Optionally, add logic here to save data
    console.log("Data saved!");
  };

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-5 text-gray-800">Profile</h1>
      <div className="flex gap-6 mb-8 items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden shadow-sm border-4 border-purple-500">
          <img src={profile} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-purple-700">John Doe</h2>
          <p className="text-gray-600">
            Your account is ready, you can now request an appointment from the appointments page.
          </p>
        </div>
      </div>
      <div className="flex justify-end mb-4">
        {!isEditable ? (
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleEdit}
          >
            Edit
          </button>
        ) : (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSave}
          >
            Save
          </button>
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
            placeholder="Enter Value"
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
            placeholder="Enter Value"
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
            placeholder="Enter Value"
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
            placeholder="Enter Value"
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
              disabled={!isEditable}
            >
              <option value="+98">+98</option>
              <option value="+1">+1</option>
            </select>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phoneNumber"
              type="text"
              placeholder="9120000000"
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
            placeholder="Enter Value"
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