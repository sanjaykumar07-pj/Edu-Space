"use client";

import { useAuth } from '@/contexts/AuthContext';
import ContributionGrid from '@/components/ContributionGrid';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [xp, setXp] = useState(0);
  const [attendance, setAttendance] = useState(100);
  const [activeCourse, setActiveCourse] = useState(null);

  useEffect(() => {
    const handleXpEarned = (e) => {
      setXp(prev => prev + e.detail);
    };
    window.addEventListener('xp-earned', handleXpEarned);
    return () => window.removeEventListener('xp-earned', handleXpEarned);
  }, []);
  
  useEffect(() => {
    if (user) {
      setXp(user.xp); // fallback
      Promise.all([
        fetch('/api/events').then(res => res.json()),
        fetch('/api/leaderboard').then(res => res.json()),
        fetch('/api/classes').then(res => res.json()),
        fetch(`/api/teacher/attendance?studentId=${user.id}`).then(res => res.json())
      ]).then(([evData, leaderData, clsData, attData]) => {
        if (Array.isArray(evData)) setEvents(evData.slice(0, 3));
        
        if (Array.isArray(leaderData)) {
          const me = leaderData.find(s => s.id === user.id);
          if (me) setXp(prev => Math.max(prev, me.xp));
        }
        
        if (Array.isArray(clsData)) {
          const myClasses = clsData.filter(c => c.studentIds.includes(user.id));
          if (myClasses.length > 0) setActiveCourse(myClasses[0]);
          
          if (Array.isArray(attData) && attData.length > 0) {
             let presentCount = 0;
             attData.forEach(r => {
               if (r.method === 'Present' || r.method === 'Face_ID' || r.method === 'Bluetooth') presentCount++;
             });
             setAttendance(Math.round((presentCount / attData.length) * 100));
          }
        }
      }).catch(console.error);
    }
  }, [user]);

  if (!user) return null;

  const getLevel = (currentXp) => {
    const level = Math.floor(currentXp / 100) + 1;
    const nextLevelXp = level * 100;
    const toNext = nextLevelXp - currentXp;
    const progress = ((currentXp % 100) / 100) * 100;
    const titles = ["Novice", "Learner", "Scholar", "Explorer", "Master", "Grandmaster"];
    const title = titles[Math.min(level - 1, titles.length - 1)];
    return { level, title, toNext, progress };
  };

  const { level, title, toNext, progress } = getLevel(xp);

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total XP Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
              <span className="material-symbols-outlined text-2xl">stars</span>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-on-surface-variant font-body-sm mb-1 uppercase tracking-wider">Total XP</p>
            <h3 className="text-on-surface font-headline-xl">{xp}</h3>
          </div>
        </div>

        {/* Current Streak Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border border-secondary-container">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary relative">
              <span className="material-symbols-outlined text-2xl animate-pulse">local_fire_department</span>
            </div>
            <div className="flex items-center gap-1 bg-secondary-container/20 px-2 py-1 rounded-full text-secondary font-label-md">
              Keep it up!
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-on-surface-variant font-body-sm mb-1 uppercase tracking-wider">Current Streak</p>
            <h3 className="text-on-surface font-headline-xl flex items-baseline gap-2">
              {user.streak} <span className="font-headline-sm text-on-surface-variant">Days</span>
            </h3>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
              <span className="material-symbols-outlined text-2xl">event_available</span>
            </div>
            <div className="flex items-center gap-1 bg-tertiary-container/10 px-2 py-1 rounded-full text-tertiary font-label-md">
              Perfect
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-on-surface-variant font-body-sm mb-1 uppercase tracking-wider">Attendance</p>
            <h3 className="text-on-surface font-headline-xl flex items-baseline gap-2">
              {attendance}<span className="font-headline-sm text-on-surface-variant">%</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Level Progress */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="font-headline-sm text-on-surface">Level {level}: {title}</h3>
                <p className="text-sm text-on-surface-variant mt-1">{toNext} XP to next level</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-outline">lock</span>
              </div>
            </div>
            <div className="w-full bg-surface-container rounded-full h-4 overflow-hidden relative">
              <div className="bg-primary h-4 rounded-full relative" style={{ width: `${progress}%` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>

        {/* Active Course */}
          {activeCourse && (
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row group">
              <div className="sm:w-1/3 bg-primary-fixed p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
                <span className="material-symbols-outlined text-5xl text-primary mb-2 relative z-10 transition-transform group-hover:scale-110">functions</span>
                <h4 className="font-headline-sm text-on-primary-fixed relative z-10">{activeCourse.code}</h4>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-headline-sm text-on-surface group-hover:text-primary transition-colors">{activeCourse.name}</h3>
                  <span className="bg-error-container text-on-error-container text-xs font-bold px-2 py-1 rounded">LIVE NOW</span>
                </div>
                <p className="text-on-surface-variant font-body-sm mb-4">Join your scheduled class session.</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-surface-container border-2 border-surface-container-lowest flex items-center justify-center text-xs">AJ</div>
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed border-2 border-surface-container-lowest flex items-center justify-center text-xs">SL</div>
                    <div className="w-8 h-8 rounded-full bg-surface-container border-2 border-surface-container-lowest flex items-center justify-center text-xs">+4</div>
                  </div>
                  <Link href={`/student/meetings/${activeCourse.id}`} className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:bg-primary-container transition-colors">
                    Join Session
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Recent Badges */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-on-surface">Recent Badges</h3>
              <a href="#" className="text-primary font-label-md hover:underline">View All</a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-surface-container-high bg-surface-bright hover:border-primary/50 transition-colors cursor-pointer text-center group">
                <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">local_fire_department</span>
                </div>
                <span className="font-label-md">5 Day Streak</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-surface-container-high bg-surface-bright hover:border-primary/50 transition-colors cursor-pointer text-center group">
                <div className="w-16 h-16 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <span className="font-label-md">Quiz Master</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-surface-container-high bg-surface-bright hover:border-primary/50 transition-colors cursor-pointer text-center group opacity-50 grayscale hover:grayscale-0 hover:opacity-100">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">lightbulb</span>
                </div>
                <span className="font-label-md">Innovator</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-surface-container-high bg-surface-bright hover:border-primary/50 transition-colors cursor-pointer text-center group opacity-50 grayscale hover:grayscale-0 hover:opacity-100">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">group</span>
                </div>
                <span className="font-label-md">Team Player</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Upcoming Schedule */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-4">Upcoming</h3>
            <div className="flex flex-col gap-3">
              {events.map((event, i) => (
                <div key={event.id} className="flex gap-4 items-start p-3 hover:bg-surface-container rounded-lg transition-colors cursor-pointer">
                  <div className={`bg-${i===0?'primary-fixed':'surface-container'} text-${i===0?'on-primary-fixed':'on-surface-variant'} rounded-lg p-2 text-center min-w-[3rem]`}>
                    <div className="text-xs font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                    <div className="font-headline-sm">{new Date(event.date).getDate()}</div>
                  </div>
                  <div>
                    <h4 className="font-label-md text-on-surface">{event.title}</h4>
                    <p className="text-sm text-on-surface-variant mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">event</span> {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/student/events" className="w-full block text-center mt-4 py-2 border border-outline-variant text-on-surface-variant rounded-lg font-label-md hover:bg-surface-container transition-colors">
              View Calendar
            </Link>
          </div>

          {/* Activity Heatmap */}
          <div className="bg-surface-container-lowest rounded-[16px] p-6 shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-4">My Activity</h3>
            <ContributionGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
