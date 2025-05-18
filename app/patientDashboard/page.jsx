import React from 'react'
import PatientSidebar from '@/components/PatientSidebar'
import BookAppointment from '@/components/BookAppointment'
const page = () => {
  return (
<div className="flex h-screen">
      <PatientSidebar className="w-fit" />
      <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
      </div>
    </div>  )
}

export default page