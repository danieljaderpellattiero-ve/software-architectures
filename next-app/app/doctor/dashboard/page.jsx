'use client';

import { useState, useEffect } from 'react';
import DoctorSidebar from '@/components/DoctorSidebar';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    completedAppointments: 0,
  });

  useEffect(() => {
    // Fetch doctor's appointments and stats
    const fetchData = async () => {
      try {
        const [appointmentsRes, statsRes] = await Promise.all([
          fetch('/api/doctor/appointments'),
          fetch('/api/doctor/stats'),
        ]);

        const appointmentsData = await appointmentsRes.json();
        const statsData = await statsRes.json();

        setAppointments(appointmentsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <DoctorSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Appointments Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Today's Appointments</h2>
            <p className="text-3xl font-bold text-indigo-600">{stats.todayAppointments}</p>
          </div>

          {/* Total Patients Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Total Patients</h2>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalPatients}</p>
          </div>

          {/* Completed Appointments Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Completed Appointments</h2>
            <p className="text-3xl font-bold text-indigo-600">{stats.completedAppointments}</p>
          </div>
        </div>

        {/* Upcoming Appointments Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {appointments.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
                        <p className="text-gray-600">{appointment.date} at {appointment.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6">
                <p className="text-gray-600">No upcoming appointments.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 