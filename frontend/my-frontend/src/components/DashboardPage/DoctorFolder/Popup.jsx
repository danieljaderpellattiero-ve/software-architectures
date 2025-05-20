import React from "react";
import "./Popup.css"; // Updated styles with unique class names
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

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
  if (!isOpen) return null;

  return (
    <div className="popup-overlay-unique">
      <div className="popup-container-unique">
        <button className="popup-close-btn" onClick={onClose}>
          x
        </button>
        <div className="popup-content-unique">
          <div className="popup-left-section">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Select Time"
                value={selectedTime}
                onChange={(newValue) => setSelectedTime(newValue)}
              />
            </LocalizationProvider>
            <textarea
              className="popup-note-input"
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="popup-right-section">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
              />
            </LocalizationProvider>
          </div>
        </div>
        <button className="popup-save-btn" onClick={onClose}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Popup;
