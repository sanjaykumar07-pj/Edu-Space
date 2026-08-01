"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useReward } from '@/contexts/RewardContext';
import { REWARDS } from '@/lib/rewardLogic';
import { useState, useEffect } from 'react';

export default function Events() {
  const { user } = useAuth();
  const { awardXP } = useReward();
  const [events, setEvents] = useState([]);

  const fetchAllEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setEvents(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const handleRSVP = async (event) => {
    try {
      const res = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          studentId: user.id,
          attendees: event.attendees
        })
      });
      if (res.ok) {
        awardXP(REWARDS.EVENT_ATTENDED.amount, REWARDS.EVENT_ATTENDED.reason);
        fetchAllEvents();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">Campus Events</h2>
          <p className="text-on-surface-variant mt-1">Discover workshops, clubs, and extracurriculars.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => {
          const isAttending = event.attendees.includes(user.id);
          const dateObj = new Date(event.date);
          
          return (
            <div key={event.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col group">
              <div className="h-32 bg-secondary-container/20 p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                <div className="bg-surface-container-lowest text-on-surface rounded-lg p-2 text-center min-w-[3.5rem] self-start shadow-sm relative z-10">
                  <div className="text-xs font-bold uppercase">{dateObj.toLocaleString('default', { month: 'short' })}</div>
                  <div className="font-headline-sm">{dateObj.getDate()}</div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-headline-sm text-on-surface mb-2">{event.title}</h3>
                <p className="text-on-surface-variant font-body-sm mb-4 line-clamp-2 flex-1">
                  {event.description}
                </p>
                
                <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                
                {isAttending ? (
                  <button disabled className="w-full py-3 bg-tertiary-container/20 text-tertiary font-label-md rounded-xl flex justify-center items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Attending
                  </button>
                ) : (
                  <button 
                    onClick={() => handleRSVP(event)}
                    className="w-full py-3 bg-surface-container text-on-surface font-label-md rounded-xl hover:bg-primary hover:text-on-primary transition-colors flex justify-center items-center gap-2 group-hover:bg-primary group-hover:text-on-primary"
                  >
                    RSVP +15 XP
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
