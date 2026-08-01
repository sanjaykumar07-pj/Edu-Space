"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import EmptyState from '@/components/EmptyState';

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/events')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setEvents(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">Campus Events</h2>
          <p className="text-on-surface-variant mt-1">Stay updated with upcoming school activities and meetings.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="py-12">
          <EmptyState icon="event_busy" title="No Upcoming Events" description="There are no events scheduled at the moment." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt, idx) => {
            const dateObj = new Date(evt.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            const day = dateObj.getDate();
            const year = dateObj.getFullYear();
            
            return (
              <div key={evt.id} className="bg-surface-container-lowest rounded-2xl p-0 shadow-sm border border-surface-container-high relative overflow-hidden group hover:shadow-md transition-all flex flex-col">
                <div className={`h-2 ${idx % 3 === 0 ? 'bg-primary' : idx % 3 === 1 ? 'bg-secondary' : 'bg-tertiary'}`}></div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex gap-4 mb-4">
                    <div className="flex flex-col items-center justify-center bg-surface-container rounded-xl min-w-[60px] p-2 border border-surface-container-high shadow-sm">
                      <span className="text-error font-bold text-xs uppercase tracking-wider">{month}</span>
                      <span className="text-on-surface font-headline-md leading-none mt-1">{day}</span>
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-on-surface leading-tight">{evt.title}</h3>
                      <p className="text-sm text-on-surface-variant mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {year}
                      </p>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-6 flex-1">
                    {evt.description}
                  </p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-surface-container-high mt-auto">
                    <div className="flex items-center gap-1 text-xs text-on-surface-variant font-medium">
                      <span className="material-symbols-outlined text-[16px]">group</span>
                      {evt.attendees} Attending
                    </div>
                    <button className="text-primary text-sm font-label-md hover:underline bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
                      RSVP
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
