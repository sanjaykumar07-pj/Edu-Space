"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import EmptyState from '@/components/EmptyState';

export default function LiveSession() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');

  const loadData = async () => {
    try {
      const [clsRes, meetRes] = await Promise.all([
        fetch(`/api/teacher/classes?teacherId=${user.id}`),
        fetch(`/api/meetings`) // Ideally filtered by teacherId in backend, but we filter here for now
      ]);
      const clsData = await clsRes.json();
      const meetData = await meetRes.json();
      
      setClasses(clsData);
      // Filter meetings for this teacher's classes
      const teacherClassIds = clsData.map(c => c.id);
      const teacherMeetings = meetData.filter(m => teacherClassIds.includes(m.classId) || m.teacherId === user.id);
      setMeetings(teacherMeetings);
      
      if (clsData.length > 0) setSelectedClassId(clsData[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && user.id) loadData();
  }, [user]);

  const [starting, setStarting] = useState(false);
  const [endingId, setEndingId] = useState(null);

  const handleStartSession = async (e) => {
    e.preventDefault();
    if (!selectedClassId) return;
    
    setStarting(true);
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClassId,
          teacherId: user.id
        })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to start session');
      }
      
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setStarting(false);
    }
  };

  const handleEndSession = async (id) => {
    if (!confirm('Are you sure you want to end this session?')) return;
    setEndingId(id);
    try {
      const res = await fetch(`/api/meetings?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to end session');
      }
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setEndingId(null);
    }
  };

  if (!user) return null;

  const liveMeetings = meetings.filter(m => m.status === 'Live');
  const pastMeetings = meetings.filter(m => m.status !== 'Live');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">Live Session</h2>
          <p className="text-on-surface-variant mt-1">Host and manage virtual classrooms.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high">
            <h3 className="font-headline-sm text-on-surface mb-4">Start New Session</h3>
            <form onSubmit={handleStartSession}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-on-surface mb-2">Select Class</label>
                <select 
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface"
                  required
                >
                  {classes.length === 0 && <option value="" disabled>No classes available</option>}
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
              <button 
                type="submit"
                disabled={starting || classes.length === 0}
                className="w-full py-3 bg-primary text-on-primary font-label-md rounded-xl hover:bg-primary-container disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
              >
                {starting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                )}
                Start Jitsi Meet
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-container-high">
            <div className="bg-surface-container-low p-4 border-b border-surface-container-high">
              <h3 className="font-headline-sm text-on-surface flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                Active Sessions
              </h3>
            </div>
            <div className="flex flex-col divide-y divide-surface-container-high">
              {liveMeetings.map(m => (
                <div key={m.id} className="p-4 flex justify-between items-center bg-error/5 hover:bg-error/10 transition-colors">
                  <div>
                    <h4 className="font-label-lg text-on-surface">{m.class}</h4>
                    <p className="text-sm text-on-surface-variant">Class Code: {m.code}</p>
                  </div>
                  <div className="flex gap-3">
                    <a 
                      href={`https://meet.jit.si/${m.roomId || 'edu-space-' + m.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-surface text-on-surface font-label-md rounded-lg border border-surface-container-high hover:bg-surface-container flex items-center justify-center"
                    >
                      Join
                    </a>
                    <button 
                      onClick={() => handleEndSession(m.id)}
                      disabled={endingId === m.id}
                      className="px-4 py-2 bg-error text-on-error font-label-md rounded-lg hover:bg-error/90 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {endingId === m.id && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      End Session
                    </button>
                  </div>
                </div>
              ))}
              {liveMeetings.length === 0 && (
                <div className="p-8 text-center text-on-surface-variant">
                  No active sessions.
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-container-high">
            <div className="bg-surface-container-low p-4 border-b border-surface-container-high">
              <h3 className="font-headline-sm text-on-surface">Past Sessions</h3>
            </div>
            <div className="flex flex-col divide-y divide-surface-container-high">
              {pastMeetings.slice(0, 5).map(m => (
                <div key={m.id} className="p-4 flex justify-between items-center hover:bg-surface-container transition-colors">
                  <div>
                    <h4 className="font-label-lg text-on-surface">{m.class}</h4>
                    <p className="text-sm text-on-surface-variant">Duration: {m.duration} • Attendees: {m.attendees}/{m.total}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-surface-container-high text-on-surface-variant rounded uppercase">Ended</span>
                </div>
              ))}
              {pastMeetings.length === 0 && (
                <div className="p-8 text-center text-on-surface-variant">
                  No past sessions recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
