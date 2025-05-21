'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      console.log('AuthContext: Checking authentication via /api/auth/me...');
      // Rely on credentials: 'include' to send the cookie.
      // Middleware should handle authentication and setting user info.
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('AuthContext: Auth check response status from /api/auth/me:', response.status);

      if (!response.ok) {
        console.log('AuthContext: Auth check failed (response not ok):', response.status);
        setUser(null); // Ensure user is null if auth check fails
        return;
      }

      const data = await response.json();
      console.log('AuthContext: Auth check response data:', data);

      if (data.success && data.user) {
        console.log('AuthContext: Auth check successful, setting user:', data.user);
        setUser(data.user);
      } else {
        console.log('AuthContext: Auth check response indicates no user or success: false', data);
        setUser(null);
      }
    } catch (error) {
      console.error('AuthContext: Auth check fetch error:', error);
      setUser(null);
    } finally {
      console.log('AuthContext: Auth check process finished.');
      setAuthLoading(false);
    }
  };

  // Check auth on mount
  useEffect(() => {
    console.log('AuthContext: Running initial checkAuth useEffect');
    checkAuth();
  }, []);

  const login = async (email, password, tempToken = null) => {
    try {
      console.log('AuthContext: Attempting login...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('AuthContext: Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // If 2FA is required, return false to indicate login is not complete
      if (data.requires2FA) {
        return false;
      }

      if (data.success && data.user) {
        console.log('AuthContext: Login successful, setting user:', data.user);
        setUser(data.user);
        
        // Small delay to allow state update and potential cookie propagation
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirect based on user role
        const redirectPath = data.user.role === 'doctor' ? '/doctorDashboard' : '/patientDashboard';
        console.log('AuthContext: Redirecting to:', redirectPath);
        router.push(redirectPath);
        
        return true;
      } else {
        console.log('AuthContext: Login response missing success or user data', data);
        return false;
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
    }
  };

  // Add debug effects
  useEffect(() => {
    console.log('AuthContext: User state changed:', user);
  }, [user]);

  useEffect(() => {
    console.log('AuthContext: Auth loading state changed:', authLoading);
  }, [authLoading]);

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 