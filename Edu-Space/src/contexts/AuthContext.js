"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check local storage for user on mount
    const storedUser = localStorage.getItem('edu_space_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

    const signup = async (role, name, email, password) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, name, email, password })
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || 'Signup failed');
      
      // Redirect to signin after successful signup
      router.push(`/auth/signin?role=${role}`);
    } catch (err) {
      throw err;
    }
  };

  const signin = async (role, email, password) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signin failed');
      
      setUser(data.user);
      localStorage.setItem('edu_space_user', JSON.stringify(data.user));
      
      // Redirect based on role
      if (data.user.role === 'admin') router.push('/admin');
      else if (data.user.role === 'teacher') router.push('/teacher');
      else router.push('/student');
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edu_space_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, signup, signin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
