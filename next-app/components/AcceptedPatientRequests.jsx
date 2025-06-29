import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useAuth } from '@/context/AuthContext';

const handleDownloadPdf = (base64) => {
  const link = document.createElement('a');
  link.href = `data:application/pdf;base64,${base64}`;
  link.download = 'uploaded_medical_document.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

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

    if (!authLoading && user && user.role === 'doctor') {
      fetchConfirmedRequests();
    }
  }, [authLoading, user]); // Depend on authLoading and user

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
              {/* Download PDF Button for Doctors */}
              {request.uploadedPdfBase64 && (
                <button
                  onClick={() => handleDownloadPdf(request.uploadedPdfBase64)}
                  className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Download PDF
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcceptedPatientRequests; 