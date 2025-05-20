'use client'; // Add this line at the very top

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from "next/image";
import connectDB from '@/config/database';

const HomePage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially unknown

  useEffect(() => {
    const checkAuth = async () => {
      // Replace this with your actual authentication check logic
      try {
        // Example: Check for a valid token in local storage or make an API call
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/auth/check', { // Replace with your API endpoint
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false); // Assume not authenticated on error
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/login');
    } else if (isAuthenticated === true) {
      // Optionally redirect authenticated users to a different page
      // router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // While checking authentication, you can display a loading state
  if (isAuthenticated === null) {
    return <div>Checking authentication...</div>;
  }

  // If authenticated, render the main page content (or it will be redirected)
  return (
    <div>Main Page</div>
  );
};

export default HomePage;