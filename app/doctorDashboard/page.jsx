'use client';
import React from 'react';
import DoctorSidebar from '@/components/DoctorSidebar';
import PatientRequests from '@/components/PatientRequests';
const page = () => {
  return (
    <div className="flex h-screen">
      <DoctorSidebar className="w-fit" />
      <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
      </div>
    </div>
  );
};

export default page;