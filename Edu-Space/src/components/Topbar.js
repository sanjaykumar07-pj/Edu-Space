"use client";

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Topbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const handleXpEarned = (e) => {
      setXp(prev => prev + e.detail);
    };
    window.addEventListener('xp-earned', handleXpEarned);
    return () => window.removeEventListener('xp-earned', handleXpEarned);
  }, []);

  useEffect(() => {
    if (user && user.role === 'student') {
      fetch('/api/leaderboard')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const me = data.find(s => s.id === user.id);
            if (me) setXp(prev => Math.max(prev, me.xp));
          }
        })
        .catch(console.error);
    }
  }, [user]);

  if (!user) return null;

  // Simple title generator from pathname
  const getTitle = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length <= 1) return 'Dashboard';
    const lastPart = parts[parts.length - 1];
    return lastPart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <header className="fixed top-0 left-[240px] right-0 h-[64px] bg-surface/80 backdrop-blur-xl z-40 flex items-center justify-between px-10 border-b border-surface-container">
      <h1 className="font-headline-sm text-on-surface">{getTitle()}</h1>
      
      <div className="flex items-center gap-6">
        {user.role === 'student' && (
          <div className="flex items-center gap-2 bg-secondary-container/20 px-3 py-1.5 rounded-full text-secondary font-label-md">
            <span className="material-symbols-outlined text-sm">stars</span>
            {xp} XP
          </div>
        )}
        
        {/* Create button removed per user request */}

        <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container">
          notifications
        </button>
        
        <div className="flex items-center gap-3 pl-2 border-l border-surface-container">
          <div className="flex flex-col items-end">
            <span className="font-label-md text-on-surface">{user.name}</span>
            <span className="text-xs text-on-surface-variant capitalize">{user.role}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold ring-2 ring-primary/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
