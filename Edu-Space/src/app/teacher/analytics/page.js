"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentAnalytics() {
  const { user } = useAuth();
  const [gradeTrend, setGradeTrend] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      fetch(`/api/analytics?teacherId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.gradeTrend) setGradeTrend(data.gradeTrend);
        })
        .catch(console.error);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">Student Analytics</h2>
          <p className="text-on-surface-variant mt-1">Track academic performance across your classes.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col min-h-[400px]">
        <h3 className="font-headline-sm text-on-surface mb-6">Class Average Grade Trend</h3>
        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gradeTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGrade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#855300" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#855300" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="term" stroke="#777587" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#777587" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e8ea" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#191c1e', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="avg" name="Avg Grade %" stroke="#855300" strokeWidth={3} fillOpacity={1} fill="url(#colorGrade)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
