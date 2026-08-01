"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import EmptyState from '@/components/EmptyState';

export default function AllEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateStr, setDateStr] = useState('');

  const loadEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) loadEvents();
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (title && description && dateStr) {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          date: new Date(dateStr).getTime(),
          createdBy: user.id
        })
      });
      await loadEvents();
      setShowModal(false);
      setTitle('');
      setDescription('');
      setDateStr('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    await loadEvents();
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">All Events</h2>
          <p className="text-on-surface-variant mt-1">Manage global campus events.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-on-primary px-6 py-2 rounded-xl font-label-md hover:bg-primary-container transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">event</span>
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high relative group">
            <button 
              onClick={() => handleDelete(event.id)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-error-container text-on-surface-variant hover:text-error transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
            <h3 className="font-headline-sm text-on-surface mb-2">{event.title}</h3>
            <p className="text-on-surface-variant font-body-sm mb-4 line-clamp-2">
              {event.description}
            </p>
            <div className="flex justify-between items-center text-sm border-t border-surface-container-high pt-4">
              <span className="text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">schedule</span> 
                {new Date(event.date).toLocaleDateString()}
              </span>
              <span className="font-semibold text-primary">{event.attendees.length} RSVPs</span>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="col-span-full">
            <EmptyState icon="event_busy" title="No events" description="Create an event to bring the campus together." />
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xl w-full max-w-md">
            <h3 className="font-headline-sm text-on-surface mb-4">Create New Event</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">Event Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-2 text-on-surface" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-2 h-24 resize-none text-on-surface" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">Date & Time</label>
                <input type="datetime-local" value={dateStr} onChange={e => setDateStr(e.target.value)} required className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-2 text-on-surface" />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 rounded-xl font-label-md text-on-surface-variant hover:bg-surface-container">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl font-label-md bg-primary text-on-primary hover:bg-primary-container">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}