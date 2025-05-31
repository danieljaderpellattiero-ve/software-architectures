'use client';
import React, { useState } from 'react';

const AppointmentModal = ({ isOpen, onClose, onSubmit }) => {
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (!appointmentDate || !appointmentTime) {
      setError('Please select both date and time.');
      return;
    }
    setError(null);
    onSubmit(appointmentDate, appointmentTime);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Schedule Appointment</h3>
          <div className="mt-2 px-7 py-3">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="mb-4">
              <label htmlFor="appointmentDate" className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
              <input
                type="date"
                id="appointmentDate"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="appointmentTime" className="block text-gray-700 text-sm font-bold mb-2">Time:</label>
              <input
                type="time"
                id="appointmentTime"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              />
            </div>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              onClick={handleSubmit}
              className="px-4 py-2 bg-purple-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Confirm Schedule
            </button>
            <button
              id="cancel-btn"
              onClick={onClose}
              className="mt-3 w-full px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal; 