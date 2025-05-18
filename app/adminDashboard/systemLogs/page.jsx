'use client';
import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import LogsList from '@/components/LogsList';

const page = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar className="w-[150px]" />
      <div className="flex-1 overflow-y-auto bg-gray-100 p-6 pl-[150px]">
        <LogsList />
      </div>
    </div>
  );
};

export default page;