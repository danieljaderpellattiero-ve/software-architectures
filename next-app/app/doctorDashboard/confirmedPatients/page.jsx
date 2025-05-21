'use client';
import React from 'react';
import DoctorSidebar from '@/components/DoctorSidebar';
import AcceptedPatientRequests from '@/components/AcceptedPatientRequests';

const ConfirmedPatientsPage = () => {
  return (
    <div className="flex h-screen">
      <DoctorSidebar className="w-[150px]" />
      <div className="flex-1 overflow-y-auto bg-gray-100 p-6 pl-[150px]">
        <AcceptedPatientRequests />
      </div>
    </div>
  );
};

export default ConfirmedPatientsPage;