import React, { useState } from "react";
// import Popup from "./Popup";
import dayjs from "dayjs";

const patientData = [
  {
    id: 1,
    name: "Alice Smith",
    issue: "Headache and dizziness",
    documentLink: "/documents/alice_smith.pdf",
  },
  {
    id: 2,
    name: "Bob Johnson",
    issue: "Persistent cough",
    documentLink: "/documents/bob_johnson.pdf",
  },
  {
    id: 3,
    name: "Charlie Brown",
    issue: "Back pain",
    documentLink: "/documents/charlie_brown.pdf",
  },
  {
    id: 4,
    name: "Diana Lee",
    issue: "Skin rash",
    documentLink: "/documents/diana_lee.pdf",
  },
];

const PatientRequests = () => {
//   const [openPopup, setOpenPopup] = useState(false); // Popup visibility state
  const [selectedTime, setSelectedTime] = useState(dayjs()); // Time state
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Date state
  const [note, setNote] = useState(""); // Note state

  return (
    <div className="flex flex-col gap-y-3 p-5">
      <h1 className="text-2xl font-semibold">Patients Requests</h1>
      {patientData.map((patient) => (
        <div
          key={patient.id}
          className="flex flex-row justify-between items-center p-4 bg-white rounded-md shadow-md"
        >
          <div className="flex-grow flex flex-row justify-between items-center">
            <span className="font-bold text-md">{patient.name}</span>
            <span className="text-sm text-gray-600">Issue: {patient.issue}</span>
            <a
              href={patient.documentLink}
              className="text-sm text-purple-700 hover:underline"
            >
              View Documents
            </a>
          </div>
          <div className="flex flex-row gap-x-2 justify-end items-center">
            <button
              className="border-none bg-none cursor-pointer text-xl p-2 rounded-full hover:bg-indigo-100 transition-colors"
            //   onClick={() => setOpenPopup(true)}
            >
              ✔️
            </button>
            <button className="border-none bg-none cursor-pointer text-xl p-2 rounded-full hover:bg-red-100 transition-colors">
              ❌
            </button>{" "}
            {/* Add onClick event to delete record */}
          </div>
        </div>
      ))}

      {/* Popup Component */}
      {/* <Popup
        isOpen={openPopup}
        onClose={() => setOpenPopup(false)}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        note={note}
        setNote={setNote}
      /> */}
    </div>
  );
};

export default PatientRequests;