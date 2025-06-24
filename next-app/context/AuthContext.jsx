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
        return null;
      }

      const data = await response.json();
      console.log('AuthContext: Auth check response data:', data);

      if (data.success && data.user) {
        console.log('AuthContext: Auth check successful, setting user:', data.user);
        setUser(data.user);
        return data.user;
      } else {
        console.log('AuthContext: Auth check response indicates no user or success: false', data);
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('AuthContext: Auth check fetch error:', error);
      setUser(null);
      return null;
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

      if (data.requires2FA) {
        return false;
      }

      if (data.success) {
        // Retry checkAuth until the user matches the expected email and role
        let freshUser = null;
        for (let i = 0; i < 10; i++) {
          freshUser = await checkAuth();
          if (
            freshUser &&
            freshUser.email === data.user.email &&
            freshUser.role === data.user.role
          ) {
            break;
          }
          await new Promise(res => setTimeout(res, 300));
        }
        if (freshUser) {
          const redirectPath =
            freshUser.role === 'doctor'
              ? '/doctorDashboard'
              : freshUser.role === 'admin'
              ? '/adminDashboard'
              : '/patientDashboard';
          console.log('AuthContext: Redirecting to:', redirectPath);
          window.location.href = redirectPath; // force full reload to use new cookie
        }
        return true;
      } else {
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
      await checkAuth(); // Ensure user state is cleared after logout
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