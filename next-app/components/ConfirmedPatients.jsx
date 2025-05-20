import React from "react";

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
    <div className="flex flex-col gap-y-3 p-5">
      <h1 className="text-xl font-semibold">Confirmed Patients</h1>
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-center bg-white rounded-md shadow p-4 gap-x-5"
        >
          <div className="flex flex-col items-center justify-center w-16 text-center text-purple-700 font-bold">
            <div className="text-sm">{appointment.day}</div>
            <div className="text-2xl">{appointment.date}</div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-600">{appointment.time}</div>
            <div className="mt-1 flex items-center gap-x-2">
              <span className="font-semibold">{appointment.patientName}</span>
              {appointment.documentsLink && (
                <a
                  href="#"
                  className="text-purple-700 text-sm underline hover:no-underline"
                >
                  {appointment.documentsLink}
                </a>
              )}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Issue: {appointment.issue}
            </div>
          </div>
          <div className="flex items-center">
            <button className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm text-purple-700 cursor-pointer flex items-center gap-x-1 hover:bg-gray-100">
              Edit <span className="text-xs">▼</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConfirmedPatients;