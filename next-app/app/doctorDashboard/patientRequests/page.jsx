'use client';
import React from 'react';
import DoctorSidebar from '@/components/DoctorSidebar';
import PatientRequests from '@/components/PatientRequests';

const page = () => {
  return (
    <div className="flex h-screen">
    <DoctorSidebar className="w-[150px]" />
    <div className="flex-1 overflow-y-auto bg-gray-100 p-6 pl-[150px]">
         {/* patients requests */}
         <PatientRequests />
         </div>
    </div>
  );
};

export default page;