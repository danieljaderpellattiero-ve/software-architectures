'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext'; // Removed useAuth

const PatientDashboardLandingPage = () => {
  const router = useRouter();
  // const { user, loading } = useAuth(); // Removed useAuth

  useEffect(() => {
    // Redirect immediately to the default patient profile page
    // Authentication is handled by middleware
    router.push('/patientDashboard/profile');
  }, [router]);

  // Render null while redirecting
  return null;
};

export default PatientDashboardLandingPage;