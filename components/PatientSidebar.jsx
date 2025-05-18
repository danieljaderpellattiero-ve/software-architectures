'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import logo from '@/public/logo.svg';
import ProfileIcon from '@/public/Profile.svg';
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Image from 'next/image';
import Loading from '../app/loading';
import { addMinimumDelay } from '../utils/delay';
import { useLoading } from '../app/providers';

const PatientSidebar = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { setIsLoading } = useLoading();

  const handleProfileNavigation = () => {
    setIsLoading(true);
    router.push("/patientDashboard/profile");
  };

  const handleBookingNavigation = () => {
    setIsLoading(true);
    router.push("/patientDashboard/bookAppointment");
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setIsLoading(true);
      console.log('Logging out...');
      localStorage.removeItem('token');
      console.log('Client-side token removed (if it existed in localStorage)');

      const response = await addMinimumDelay(
        fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      if (response.ok) {
        console.log('Server-side logout successful');
      } else {
        console.error('Server-side logout failed:', response.status);
      }

      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      console.log('Authentication cookie cleared (if it existed)');
      
      // Add a small delay before navigation to ensure loading state is visible
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push("/");
      console.log('Navigating to homepage');
    } catch (error) {
      console.error('Error during logout request:', error);
      setIsLoggingOut(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoggingOut && <Loading />}
      <div className="fixed top-0 left-0 h-screen w-[120px] bg-[#6c4c94] flex flex-col items-center py-5 overflow-y-auto z-[100]">
        <div className="mb-5">
          <Image
            src={logo}
            alt="Logo"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>

        <div className="flex flex-col justify-between flex-1 w-full">
          <div className="flex flex-col items-center gap-5 mb-5">
            <button
              onClick={handleProfileNavigation}
              className="p-2 hover:scale-110 hover:bg-[#9b7bbd] hover:cursor-pointer transition-all duration-300 rounded-lg"
            >
              <Image alt='profileButton' src={ProfileIcon} className="w-[40px] h-[40px]"/>
            </button>
            <button
              onClick={handleBookingNavigation}
              className="p-2 hover:scale-110 hover:bg-[#9b7bbd] hover:cursor-pointer transition-all duration-300 rounded-lg"
            >
              <ClipboardDocumentListIcon className="w-[40px] h-[40px] text-white" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-5 mb-5">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`p-2 hover:scale-110 hover:bg-[#9b7bbd] hover:cursor-pointer transition-all duration-300 rounded-lg ${
                isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ArrowLeftOnRectangleIcon className="w-[40px] h-[40px] text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientSidebar;