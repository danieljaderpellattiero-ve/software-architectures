import React, { useState, useEffect } from "react";
// import Popup from "./Popup";
import dayjs from "dayjs";
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import Cookies from 'js-cookie';
// Remove backend imports from frontend component
// import mongoose from "mongoose";
// import PatientRequest from "@/models/patientRequest";

// Remove dummy datad
// const patientData = [ ... ];

const PatientRequests = () => {
  const { user, authLoading } = useAuth(); // Get user and authLoading from useAuth
  const [requests, setRequests] = useState([]); // State to store fetched requests
  // Removed explicit loading and error states as per previous styling

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
    return <div>No patient requests found.</div>; // Or return null
  }

  const handleAccept = async (requestId) => {
    try {
      console.log('PatientRequests: Attempting to accept request:', requestId);
      const response = await fetch(`/api/doctor/patientrequests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('PatientRequests: Error accepting request:', errorData.message || 'Failed to accept patient request');
        // Handle error in UI, e.g., show a temporary message
      } else {
        const updatedRequest = await response.json();
        console.log('PatientRequests: Request accepted successfully:', updatedRequest);
        // Remove the accepted request from the state
        setRequests(requests.filter(req => req._id !== requestId));
      }
    } catch (err) {
      console.error('PatientRequests: Error accepting request (catch block):', err);
      // Handle error in UI
    }
  };

  const handleDeny = async (requestId) => {
    try {
      console.log('PatientRequests: Attempting to deny request:', requestId);
      const response = await fetch(`/api/doctor/patientrequests/${requestId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('PatientRequests: Error denying request:', errorData.message || 'Failed to deny patient request');
        // Handle error in UI
      } else {
        console.log('PatientRequests: Request denied successfully:', requestId);
        // Remove the denied request from the state
        setRequests(requests.filter(req => req._id !== requestId));
      }
    } catch (err) {
      console.error('PatientRequests: Error denying request (catch block):', err);
      // Handle error in UI
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Patient Requests</h2>
      {requests.map((request) => (
        <div key={request._id} className="border p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{request.patientName}</h3>
            <p>Request: {request.request}</p>
            <p>Status: {request.status ? 'Accepted' : 'Pending'}</p>
            <p>Date: {dayjs(request.createdAt).format('YYYY-MM-DD HH:mm')}</p>
          </div>
          <div className="flex space-x-2">
            {request.status === false && (
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={() => handleAccept(request._id)}
              >
                Accept
              </button>
            )}
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => handleDeny(request._id)}
            >
              {request.status === true ? 'Delete' : 'Deny'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientRequests;