import React from "react";
import "./ConfirmedPatients.css"; // Create this CSS file for styling

const ConfirmedPatients = () => {
  const appointments = [
    {
      id: 1,
      day: "Thu",
      date: 15,
      time: "09:00am - 09:30am",
      patientName: "Stephine Claire",
      issue: "Fever",
      documentsLink: "View Documents",
    },
    {
      id: 2,
      day: "Fri",
      date: 16,
      time: "09:00am - 09:30am",
      patientName: "Stephine Claire",
      issue: "Fever",
      documentsLink: "View Documents",
    },
    {
      id: 3,
      day: "Mon",
      date: 19,
      time: "09:00am - 09:30am",
      patientName: "Stephine Claire",
      issue: "-",
      documentsLink: "",
    },
  ];

  return (
    <div className="confirmed-calendar">
      <h1>Confirmed Patients</h1>
      {appointments.map((appointment) => (
        <div key={appointment.id} className="appointment-card">
          <div className="date-section">
            <div className="day">{appointment.day}</div>
            <div className="date">{appointment.date}</div>
          </div>
          <div className="details-section">
            <div className="time">{appointment.time}</div>
            <div className="patient-info">
              <span className="patient-name">{appointment.patientName}</span>
              {appointment.documentsLink && (
                <a href="#" className="documents-link">
                  {appointment.documentsLink}
                </a>
              )}
            </div>
            <div className="issue">Issue: {appointment.issue}</div>
          </div>
          <div className="action-section">
            <button className="edit-button">
              Edit <span className="dropdown-arrow">▼</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConfirmedPatients;
