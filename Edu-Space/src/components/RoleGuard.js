"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSkeleton from './LoadingSkeleton';

export default function RoleGuard({ children, allowedRole }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      } else if (allowedRole && user.role !== allowedRole) {
        if (user.role === 'admin') router.push('/admin');
        else if (user.role === 'teacher') router.push('/teacher');
        else router.push('/student');
      }
    }
  }, [user, loading, allowedRole, router]);

  if (loading || !user || (allowedRole && user.role !== allowedRole)) {
    return (
      <div className="h-screen w-full flex items-center justify-center p-8">
        <LoadingSkeleton />
      </div>
    );
  }

  return <>{children}</>;
}
