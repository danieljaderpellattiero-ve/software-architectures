import React from "react";
import "./Popup.css"; // Styles for Popup component
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import dayjs from "dayjs";

const Popup = ({
  isOpen,
  onClose,
  selectedTime,
  setSelectedTime,
  selectedDate,
  setSelectedDate,
  note,
  setNote,
}) => {
  if (!isOpen) return null; // Do not render anything if not open

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-btn" onClick={onClose}>x</button>
        <div className="popup-content">
          {/* Left Section: Time Picker and Note Input */}
          <div className="left">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Select Time"
                value={selectedTime}
                onChange={(newValue) => setSelectedTime(newValue)}
              />
            </LocalizationProvider>
            <textarea
              className="note-input"
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Right Section: Static Date Picker */}
          <div className="right">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
              />
            </LocalizationProvider>
          </div>
        </div>
        <button className="save-btn" onClick={onClose}>Save</button>
      </div>
    </div>
  );
};

export default Popup;
