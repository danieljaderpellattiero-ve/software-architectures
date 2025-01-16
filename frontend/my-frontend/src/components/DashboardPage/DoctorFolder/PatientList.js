import React, { useState } from "react";
import "./PatientList.css"; // Your Patient List styles
import data from "../../../Data/data.json"; // Import your JSON data
import Popup from "./Popup";
import dayjs from "dayjs";

const PatientList = () => {
  const [openPopup, setOpenPopup] = useState(false); // Popup visibility state
  const [selectedTime, setSelectedTime] = useState(dayjs()); // Time state
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Date state
  const [note, setNote] = useState(""); // Note state

  return (
    <div className="patient-list">
      {data.map((patient) => (
        <div key={patient.id} className="patient-card">
          <div className="patient-info">
            <span className="patient-name">{patient.name}</span>
            <span className="patient-issue">Issue: {patient.issue}</span>
            <a href={patient.documentLink} className="document-link">
              View Documents
            </a>
          </div>
          <div className="patient-actions">
            <button
              className="action-btn confirm-btn"
              onClick={() => setOpenPopup(true)}
            >
              ✔️
            </button>
            <button className="action-btn reject-btn">❌</button>
          </div>
        </div>
      ))}

      {/* Popup Component */}
      <Popup
        isOpen={openPopup}
        onClose={() => setOpenPopup(false)}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        note={note}
        setNote={setNote}
      />
    </div>
  );
};

export default PatientList;
