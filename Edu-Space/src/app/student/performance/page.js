"use client";

import { useAuth } from '@/contexts/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

import { useState, useEffect } from 'react';

const mockSubjectData = [
  { subject: 'Math', score: 92 },
  { subject: 'Physics', score: 85 },
  { subject: 'Chemistry', score: 78 },
  { subject: 'History', score: 88 },
];

export default function Performance() {
  const { user } = useAuth();
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`/api/analytics?studentId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.gradeTrend) {
            setPerformanceData(data.gradeTrend);
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
          <h2 className="font-headline-lg text-on-surface">Performance Analytics</h2>
          <p className="text-on-surface-variant mt-1">Track your academic progress over time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="font-headline-sm text-on-surface mb-6">Quiz Score Trends</h3>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
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
                <Legend />
                <Area type="monotone" dataKey="score" name="Your Score" stroke="#3525cd" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                <Area type="monotone" dataKey="avg" name="Class Average" stroke="#777587" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="font-headline-sm text-on-surface mb-6">Scores by Subject</h3>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSubjectData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="subject" stroke="#777587" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#777587" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e8ea" />
                <Tooltip 
                  cursor={{ fill: '#f8f9fb' }}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" name="Score" fill="#855300" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
