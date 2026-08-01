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
      // Bypassing database, instantly redirect to signin
      router.push(`/auth/signin?role=${role}`);
    } catch (err) {
      throw err;
    }
  };

  const signin = async (role, email, password) => {
    try {
      // Bypassing database, create mock user directly
      const mockUser = {
        id: `mock-user-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        role: role,
        xp: 0
      };
      
      setUser(mockUser);
      localStorage.setItem('edu_space_user', JSON.stringify(mockUser));
      
      // Redirect based on role
      if (role === 'admin') router.push('/admin');
      else if (role === 'teacher') router.push('/teacher');
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
