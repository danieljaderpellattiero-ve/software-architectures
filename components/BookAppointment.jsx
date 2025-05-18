import React from "react";
import Image from "next/image";

import doctorImage from "@/public/doctorImage.svg"; // Replace with an actual path to your image

const BookAppointment = () => {
  const doctors = [
    { id: 1, name: "Dr. Jane Cooper" },
    { id: 2, name: "Dr. John Smith" },
    { id: 3, name: "Dr. Lisa Adams" },
    { id: 4, name: "Dr. Mark Lee" },
    // Add more doctors here
  ];

  return (
    <div className="p-5 bg-gray-100 rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-purple-700 mb-5">Book New Appointment</h1>
      <div className="flex flex-col gap-5">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
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