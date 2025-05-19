'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext'; // Removed useAuth

const PatientDashboardLandingPage = () => {
  const router = useRouter();
  // const { user, loading } = useAuth(); // Removed useAuth

  useEffect(() => {
    // Add a small delay before redirecting to ensure router is ready
    const timer = setTimeout(() => {
      // Redirect to the default patient profile page
      router.push('/patientDashboard/profile');
    }, 50);

    return () => clearTimeout(timer); // Clean up the timer

  }, [router]);

  // Render null while redirecting
  return null;
};

export default PatientDashboardLandingPage;