"use client";

import { useAuth } from '@/contexts/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

const mockEngagementData = [
  { name: 'Mon', engagement: 65 },
  { name: 'Tue', engagement: 78 },
  { name: 'Wed', engagement: 85 },
  { name: 'Thu', engagement: 92 },
  { name: 'Fri', engagement: 88 },
  { name: 'Sat', engagement: 45 },
  { name: 'Sun', engagement: 32 },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 0 });
  const [attendance, setAttendance] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [engagementData, setEngagementData] = useState(mockEngagementData);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetch('/api/students').then(res => res.json()),
        fetch('/api/teachers').then(res => res.json()),
        fetch('/api/classes').then(res => res.json()),
        fetch('/api/teacher/attendance').then(res => res.json()),
        fetch('/api/leaderboard').then(res => res.json())
      ]).then(([studentsData, teachersData, classesData, attData, leaderData]) => {
        setStats({
          students: Array.isArray(studentsData) ? studentsData.length : 0,
          teachers: Array.isArray(teachersData) ? teachersData.length : 0,
          classes: Array.isArray(classesData) ? classesData.length : 0,
        });

        if (Array.isArray(attData) && attData.length > 0) {
          let presentCount = 0;
          const daysMap = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
          const trendData = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };

          attData.forEach(r => {
             if (r.method === 'Present' || r.method === 'Face_ID' || r.method === 'Bluetooth') presentCount++;
             
             const d = new Date(r.date);
             if (!isNaN(d)) {
               const dayName = daysMap[d.getDay()];
               if (dayName) trendData[dayName] = (trendData[dayName] || 0) + 1;
             }
          });
          setAttendance(Math.round((presentCount / attData.length) * 100));

          const orderedTrend = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
             name: day,
             engagement: trendData[day] || 0
          }));
          setEngagementData(orderedTrend);
        } else {
          // No data, flatline
          const emptyTrend = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
             name: day,
             engagement: 0
          }));
          setEngagementData(emptyTrend);
        }

        if (Array.isArray(leaderData)) {
          const sum = leaderData.reduce((acc, curr) => acc + (curr.xp || 0), 0);
          setTotalXp(sum);
        }
      }).catch(console.error);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-on-surface-variant font-body-sm mb-1 uppercase tracking-wider">Total Students</p>
            <h3 className="text-on-surface font-headline-xl">{stats.students}</h3>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-2xl">co_present</span>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-on-surface-variant font-body-sm mb-1 uppercase tracking-wider">Total Teachers</p>
            <h3 className="text-on-surface font-headline-xl">{stats.teachers}</h3>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-2xl">class</span>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-on-surface-variant font-body-sm mb-1 uppercase tracking-wider">Total Classes</p>
            <h3 className="text-on-surface font-headline-xl">{stats.classes}</h3>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-2xl">event_available</span>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-on-surface-variant font-body-sm mb-1 uppercase tracking-wider">Overall Attendance</p>
            <h3 className="text-on-surface font-headline-xl">{attendance}%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Trend */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="font-headline-sm text-on-surface mb-6">Platform Engagement Trend</h3>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3525cd" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3525cd" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#777587" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#777587" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e8ea" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#191c1e', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="engagement" name="Active Users" stroke="#3525cd" strokeWidth={3} fillOpacity={1} fill="url(#colorEngage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Total XP Highlight */}
        <div className="flex flex-col gap-6">
          <div className="bg-primary rounded-2xl p-6 shadow-sm text-on-primary flex flex-col justify-center items-center text-center h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <span className="material-symbols-outlined text-6xl mb-4 animate-pulse">workspace_premium</span>
            <p className="font-body-lg uppercase tracking-widest mb-2 opacity-80">Total XP Awarded</p>
            <h3 className="font-headline-xl text-5xl">{totalXp.toLocaleString()}</h3>
            <p className="mt-4 font-body-sm opacity-80 bg-black/20 px-4 py-2 rounded-full">
              Across all students this semester
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
