import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useAuth } from '@/context/AuthContext';

const AcceptedPatientRequests = () => {
  const { user, authLoading } = useAuth();
  const [confirmedRequests, setConfirmedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfirmedRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch confirmed requests from the new API endpoint
        const response = await fetch('/api/doctor/confirmed-requests');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched confirmed requests:', data);
        setConfirmedRequests(data);
      } catch (err) {
        console.error('Error fetching confirmed requests:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedRequests();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) return <div className="text-center p-4">Loading confirmed appointments...</div>;
  if (error) return <div className="text-red-500 p-4">Error loading confirmed appointments: {error}</div>;
  if (confirmedRequests.length === 0) return <div className="text-center p-4">No confirmed appointments yet.</div>;

  return (
    <div className="space-y-4">
      <div className="p-5 bg-gray-100 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-purple-700 mb-5">Confirmed Appointments</h1>
        <div className="flex flex-col gap-5">
          {confirmedRequests.map((request) => (
            <div
              key={request._id}
              className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm max-w-full"
            >
              <div>
                <span className="text-lg font-medium text-gray-800">Patient: {request.patientName}</span>
                <p className="text-gray-600 text-sm">Request: {request.request}</p>
                {request.appointmentDateTime && (
                   <p className="text-gray-600 text-sm">Appointment: {new Date(request.appointmentDateTime).toLocaleString()}</p>
                )}
              </div>
              {/* Add any other relevant details or actions here */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcceptedPatientRequests; 