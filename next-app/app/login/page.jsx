// File: app/login/page.js (or your specific path)
'use client'; // Essential for using hooks and handling events

import React, { useState } from "react"; // Removed unused useEffect
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Make sure heroicons is installed
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import TwoFactorAuth from "@/components/TwoFactorAuth";

function LoginPage() {
  console.log('LoginPage: Component rendering'); // Added log
  const router = useRouter(); // Initialize router
  const { login } = useAuth(); // Get login function from AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [tempAuthData, setTempAuthData] = useState(null);
  const [user, setUser] = useState(null);
  const [authCode, setAuthCode] = useState("");

  // Basic form validation
  const validateForm = () => {
    console.log('LoginPage: validateForm called'); // Added log
    setError(""); // Clear previous errors
    if (!email || !password) {
      setError("Please fill in both email and password fields.");
      return false;
    }
    // Basic email format check
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  // Handle login submission
  const handleLogin = async (e) => {
    console.log('LoginPage: handleLogin called');
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.requires2FA) {
        setTempAuthData(data.tempToken);
        setShow2FAModal(true);
      } else {
        const success = await login(email, password);
        if (success) {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      console.error('LoginPage: Login error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASuccess = () => {
    console.log('LoginPage: 2FA verification successful, redirecting to dashboard');
    setShow2FAModal(false);
    setTempAuthData(null);
    router.push('/dashboard');
  };

  // JSX for the Login Form
  console.log('LoginPage: Rendering JSX'); // Added log
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">Login</h3>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>
          <div className="relative">
            <label className="block text-gray-700 dark:text-gray-300">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>
            <Link href="/forgot-password" // Make sure this route exists
                 className="text-sm text-purple-600 hover:underline dark:text-purple-400">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account yet?{" "}
          <Link href="/register" // Make sure this route exists
               className="font-medium text-purple-600 hover:underline dark:text-purple-400">
            Register here
          </Link>
        </p>
      </div>
      {show2FAModal && (
        <TwoFactorAuth
          email={email}
          tempToken={tempAuthData}
          onVerifySuccess={handle2FASuccess}
          onClose={() => setShow2FAModal(false)}
        />
      )}
    </div>
  );
}

export default LoginPage;