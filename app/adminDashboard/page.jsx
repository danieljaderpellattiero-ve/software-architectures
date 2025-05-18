'use client';
import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import UsersList from '@/components/UsersList';

const page = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar className="w-fit" />
      <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
        {/* <UsersList /> */}
      </div>
    </div>
  );
};

export default page;