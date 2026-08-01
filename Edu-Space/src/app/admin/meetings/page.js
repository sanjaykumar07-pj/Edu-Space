"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import EmptyState from '@/components/EmptyState';

export default function AllMeetings() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    if (user) {
      fetch('/api/meetings')
        .then(res => res.json())
        .then(data => setMeetings(data))
        .catch(console.error);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">All Meetings</h2>
          <p className="text-on-surface-variant mt-1">Monitor active and past Jitsi sessions.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 p-4 border-b border-surface-container-high bg-surface-container-low font-label-md text-on-surface-variant uppercase tracking-wider text-xs">
          <div>Session</div>
          <div className="w-24 text-center">Status</div>
          <div className="w-24 text-center">Duration</div>
          <div className="w-24 text-right">Attendees</div>
        </div>
        
        <div className="flex flex-col divide-y divide-surface-container-high">
          {meetings.map(meet => (
            <div key={meet.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 p-4 items-center hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-sm">videocam</span>
                </div>
                <div>
                  <span className="font-label-md text-on-surface block">{meet.class}</span>
                  <span className="text-xs text-on-surface-variant">{meet.code}</span>
                </div>
              </div>
              <div className="w-24 text-center">
                {meet.status === 'Live' ? (
                  <span className="bg-error-container text-on-error-container text-[10px] uppercase font-bold px-2 py-1 rounded animate-pulse">Live Now</span>
                ) : (
                  <span className="bg-surface-container-high text-on-surface-variant text-[10px] uppercase font-bold px-2 py-1 rounded">Ended</span>
                )}
              </div>
              <div className="w-24 text-center text-sm font-semibold text-on-surface">
                {meet.duration}
              </div>
              <div className="w-24 text-right text-sm text-on-surface-variant">
                {meet.attendees} / {meet.total}
              </div>
            </div>
          ))}
          {meetings.length === 0 && (
            <EmptyState icon="videocam_off" title="No meetings" description="No meetings have been hosted yet." />
          )}
        </div>
      </div>
    </div>
  );
}