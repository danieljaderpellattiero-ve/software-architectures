import React, { useState, useEffect } from "react";
// import Popup from "./Popup";
import dayjs from "dayjs";
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/app/providers';
import AppointmentModal from './AppointmentModal'; // Import the new modal component
// Remove backend imports from frontend component
// import mongoose from "mongoose";
// import PatientRequest from "@/models/patientRequest";

// Remove dummy datad
// const patientData = [ ... ];

const handleDownloadPdf = (base64) => {
  const link = document.createElement('a');
  link.href = `data:application/pdf;base64,${base64}`;
  link.download = 'uploaded_medical_document.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const PatientRequests = () => {
  const { user, authLoading } = useAuth(); // Get user and authLoading from useAuth
  const [requests, setRequests] = useState([]); // State to store fetched requests
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedRequest, setSelectedRequest] = useState(null); // State to store the request being scheduled
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchRequests = async () => {
      console.log('PatientRequests: User:', user);
      console.log('PatientRequests: AuthLoading:', authLoading);

      // Wait for authLoading to be false and user to be available
      if (authLoading || !user) {
        console.log('PatientRequests: Auth still loading or no user, skipping fetch');
        // Do not set local loading/error state here, just return
        return;
      }

      try {
        console.log('PatientRequests: Fetching requests for user:', user.id, 'role:', user.role);
        // Use the userId set by middleware, no need for Authorization header here
        const response = await fetch(`/api/patientrequests?${user.role === 'doctor' ? 'doctorId' : 'patientId'}=${user.id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            // Removed manual Authorization header, rely on cookie + middleware
            // 'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          // Log error but do not set local error state to avoid rendering error message directly in component
          console.error('PatientRequests: Error fetching requests:', errorData.error || 'Failed to fetch patient requests');
          // Optionally clear requests or leave old data
           setRequests([]); // Clear requests on error

        } else {
           const data = await response.json();
           console.log('PatientRequests: Fetched data:', data);
           setRequests(data);
        }
      } catch (err) {
        console.error('PatientRequests: Error fetching requests (catch block):', err);
         setRequests([]); // Clear requests on error
      }
      // Do not set local loading state in finally, component handles display based on requests state
    };

    fetchRequests();
    // Rerun effect when user or authLoading changes
  }, [user, authLoading]);

  // Simplified rendering based on whether requests data is available
  if (!requests || requests.length === 0) {
    // You might want a minimal loading indicator or nothing here based on desired old styling
    // For now, just show nothing if no requests, assuming the parent handles overall loading
    return (
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
        <p className="font-bold">No Pending Patient Requests</p>
        <p>There are currently no patient requests awaiting your attention.</p>
      </div>
    );
  }

  const handleAcceptRequest = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
    console.log('Accepting request:', request);
    // TODO: Implement logic to update request status to accepted and set appointment time
  };

  const handleModalSubmit = async (date, time) => {
    console.log('Scheduling appointment for request:', selectedRequest._id, 'on', date, 'at', time);
    
    // TODO: Implement API call to update request with scheduled date and time
    try {
      const response = await fetch(`/api/doctor/requests/${selectedRequest._id}/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, time }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to schedule appointment');
      }

      console.log('Appointment scheduled successfully:', data);
      // After successful API call:
      // Remove the accepted request from the current list
      setRequests(requests.filter(req => req._id !== selectedRequest._id));
      alert(data.message || 'Appointment scheduled successfully!');

    } catch (error) {
      console.error('Error scheduling appointment:', error);
      alert(error.message || 'Failed to schedule appointment. Please try again.');
      // Optionally, handle error state or revert UI changes
    } finally {
      // Close the modal
      setIsModalOpen(false);
      // Clear the selected request
      setSelectedRequest(null);
    }
  };

  const handleModalClose = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleRejectRequest = async (requestId) => {
    console.log('Rejecting request with ID:', requestId);
    // TODO: Implement logic to update request status to rejected
    try {
      const response = await fetch(`/api/doctor/requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('PatientRequests: Error rejecting request:', errorData.message || 'Failed to reject patient request');
        // Handle error in UI
      } else {
        console.log('PatientRequests: Request rejected successfully:', requestId);
        // Remove the rejected request from the state
        setRequests(requests.filter(req => req._id !== requestId));
      }
    } catch (err) {
      console.error('PatientRequests: Error rejecting request (catch block):', err);
      // Handle error in UI
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Patient Requests</h2>
      {requests.map((request) => (
        <div key={request._id} className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center transition duration-300 ease-in-out hover:shadow-md">
          <div>
            <h3 className="font-semibold">{request.patientName}</h3>
            <p>Request: {request.request}</p>
            <p>Status: {request.status ? 'Accepted' : 'Pending'}</p>
            <p>Date: {dayjs(request.createdAt).format('YYYY-MM-DD HH:mm')}</p>
          </div>
          <div className="flex space-x-2 items-center">
            {request.status === false && (
              <button
                onClick={() => handleAcceptRequest(request)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm cursor-pointer"
              >
                Accept
              </button>
            )}
            <button
              onClick={() => handleRejectRequest(request._id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm cursor-pointer"
            >
              Reject
            </button>
            {/* Download PDF Button for Pending Requests */}
            {request.uploadedPdfBase64 && (
              <button
                onClick={() => handleDownloadPdf(request.uploadedPdfBase64)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm ml-2 cursor-pointer"
              >
                Download PDF
              </button>
            )}
          </div>
        </div>
      ))}
      {/* Appointment Scheduling Modal */}
      <AppointmentModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default PatientRequests;