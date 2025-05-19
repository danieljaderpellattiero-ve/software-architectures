'use client'
import React from 'react'
import PatientSidebar from '@/components/PatientSidebar'
import PatientProfile from '@/components/PatientProfile'

const ProfilePage = () => {
  // Authentication is handled by middleware, so we can assume the user is authenticated if this page renders.
  // The PatientProfile component will fetch the user data via its API route.

  return (
    <div className="flex h-screen">
      <PatientSidebar className="w-[150px]" />
      <div className="flex-1 overflow-y-auto bg-gray-100 p-6 pl-[150px]">
        <PatientProfile />
      </div>
    </div>
  )
}

export default ProfilePage