import React from 'react';

const BookingPopUp = ({ doctorName, onClose }) => {
  console.log('Rendering BookingPopUp with doctorName:', doctorName);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment Request Sent</h2>
          <p className="text-gray-600 mb-6">
            {doctorName} will reply with suitable date and time as soon as possible.
          </p>
          <button
            onClick={onClose}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPopUp;