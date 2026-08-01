"use client";

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function MeetingsList() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (user) {
      fetch('/api/classes')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setClasses(data.filter(c => c.studentIds.includes(user.id)));
          }
        })
        .catch(console.error);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">Live Meetings</h2>
          <p className="text-on-surface-variant mt-1">Join your scheduled class sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(c => (
          <div key={c.id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high flex flex-col hover:border-primary/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">video_camera_front</span>
              </div>
              <span className="bg-error-container text-on-error-container text-xs font-bold px-2 py-1 rounded animate-pulse">LIVE NOW</span>
            </div>
            
            <h3 className="font-headline-sm text-on-surface mb-1">{c.name}</h3>
            <p className="text-on-surface-variant font-body-sm mb-6">{c.code}</p>
            
            <div className="mt-auto">
              <Link 
                href={`/student/meetings/${c.id}`}
                className="w-full py-3 bg-primary text-on-primary font-label-md rounded-xl hover:bg-primary-container transition-colors flex justify-center items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                Join Meeting
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
