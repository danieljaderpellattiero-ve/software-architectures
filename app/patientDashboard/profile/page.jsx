import React from 'react'
import PatientSidebar from '@/components/PatientSidebar'
import BookAppointment from '@/components/BookAppointment'
import PatientProfile from '@/components/PatientProfile'

const page = () => {
  return (
    <div className="flex h-screen">
    <PatientSidebar className="w-[150px]" />
    <div className="flex-1 overflow-y-auto bg-gray-100 p-6 pl-[150px]">
      <PatientProfile />
    </div>
  </div>  )
}

export default page