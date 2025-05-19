'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('AuthContext: checkAuth started');
      try {
        const token = Cookies.get('token');
        console.log('AuthContext: Token from cookie:', token ? 'Found' : 'Not found');

        if (!token) {
          console.log('AuthContext: No token, setting user to null and loading to false');
          setUser(null);
          setLoading(false);
          return;
        }

        console.log('AuthContext: Fetching /api/auth/me');
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('AuthContext: /api/auth/me response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('AuthContext: Authentication failed:', errorData);
          throw new Error(errorData.error || 'Authentication failed');
        }

        const data = await response.json();
        console.log('AuthContext: User data received:', data);
        setUser(data);
      } catch (error) {
        console.error('AuthContext: Auth check failed in catch block:', error);
        Cookies.remove('token');
        setUser(null);
      } finally {
        console.log('AuthContext: checkAuth finished, setting loading to false');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      Cookies.set('token', data.token, { expires: 7 });
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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