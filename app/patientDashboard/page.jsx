'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PatientDashboardLandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the default patient profile page
    router.push('/patientDashboard/profile');
  }, [router]);

  // You can return a loading spinner or null while redirecting
  return null; 
};

export default PatientDashboardLandingPage;