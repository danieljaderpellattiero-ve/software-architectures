import React from "react";
import { Dialog, DialogTitle, DialogContent, Table, TableBody, TableRow, TableCell, Button } from "@mui/material";

const PatientModal = ({ open, onClose, patient }) => {
  if (!patient) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Patient Information
        <Button
          style={{
            float: "right",
            backgroundColor: "#d9534f",
            color: "white",
          }}
          onClick={onClose}
        >
          Close
        </Button>
      </DialogTitle>
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell><strong>Name:</strong></TableCell>
              <TableCell>{patient.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Email:</strong></TableCell>
              <TableCell>{patient.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Phone Number:</strong></TableCell>
              <TableCell>{patient.phoneNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Date of Birth:</strong></TableCell>
              <TableCell>{patient.dateOfBirth}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Country:</strong></TableCell>
              <TableCell>{patient.country}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>City:</strong></TableCell>
              <TableCell>{patient.city}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default PatientModal;
