'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";

import doctorImage from "@/public/doctorImage.svg"; // Replace with an actual path to your image

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/doctors');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) return <div className="text-center p-4">Loading doctors...</div>;
  if (error) return <div className="text-red-500 p-4">Error loading doctors: {error}</div>;
  if (doctors.length === 0) return <div className="text-center p-4">No doctors available.</div>;

  return (
    <div className="p-5 bg-gray-100 rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-purple-700 mb-5">Book New Appointment</h1>
      <div className="flex flex-col gap-5">
        {doctors.map((doctor) => (
          <div
            key={doctor._id} // Use _id from MongoDB as key
            className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm max-w-full"
          >
            <img
              src={doctorImage}
              className="w-10 h-10 rounded-full border-2 border-purple-700"
              alt="Doctor Profile"
            />
            <span className="text-lg font-medium text-gray-800 flex-1 ml-4">{doctor.name}</span>
            <button className="bg-purple-700 text-white rounded-full w-8 h-8 font-bold text-xl cursor-pointer transition-colors hover:bg-purple-600">
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookAppointment;