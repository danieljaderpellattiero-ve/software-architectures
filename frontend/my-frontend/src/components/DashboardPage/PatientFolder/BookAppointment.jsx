import React from "react";
import doctorImage from "../../../Images/doctorImage.svg"; // Replace with an actual path to your image
import "./BookAppointment.css";

const BookAppointment = () => {
  const doctors = [
    { id: 1, name: "Dr. Jane Cooper" },
    { id: 2, name: "Dr. John Smith" },
    { id: 3, name: "Dr. Lisa Adams" },
    { id: 4, name: "Dr. Mark Lee" },
    // A  dd more doctors here
  ];

  return (
    <div className="book-appointment-content">
      <h1 className="pageTitle">Book New Appointment</h1>
      <div className="doctor-list">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <img src={doctorImage} className="doctor-image" alt="Doctor Profile" />
            <span className="doctor-name">{doctor.name}</span>
            <button className="plus-button">+</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookAppointment;
