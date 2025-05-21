import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useAuth } from '@/context/AuthContext';

const AcceptedPatientRequests = () => {
  const { user, authLoading } = useAuth();
  const [acceptedRequests, setAcceptedRequests] = useState([]);

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      console.log('AcceptedPatientRequests: User:', user);
      console.log('AcceptedPatientRequests: AuthLoading:', authLoading);

      if (authLoading || !user) {
        console.log('AcceptedPatientRequests: Auth still loading or no user, skipping fetch');
        return;
      }

      try {
        console.log('AcceptedPatientRequests: Fetching accepted requests for doctor:', user.id);
        
        const response = await fetch(`/api/doctor/acceptedrequests?doctorId=${user.id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('AcceptedPatientRequests: Error fetching accepted requests:', errorData.error || 'Failed to fetch accepted patient requests');
          setAcceptedRequests([]);
        } else {
           const data = await response.json();
           console.log('AcceptedPatientRequests: Fetched data:', data);
           setAcceptedRequests(data);
        }
      } catch (err) {
        console.error('AcceptedPatientRequests: Error fetching accepted requests (catch block):', err);
        setAcceptedRequests([]);
      }
    };

    fetchAcceptedRequests();
  }, [user, authLoading]);

  if (!acceptedRequests || acceptedRequests.length === 0) {
    return <div>No accepted patient requests found.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Accepted Patient Requests</h2>
      {acceptedRequests.map((request) => (
        <div key={request._id} className="border p-4 rounded-lg shadow">
          <h3 className="font-semibold">{request.patientName}</h3>
          <p>Request: {request.request}</p>
          <p>Accepted On: {dayjs(request.acceptedAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
      ))}
    </div>
  );
};

export default AcceptedPatientRequests; 