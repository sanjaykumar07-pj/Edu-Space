"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AttendanceOverview() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [todayStats, setTodayStats] = useState({ present: 0, absent: 0, excused: 0 });

  useEffect(() => {
    if (user) {
      fetch('/api/attendance')
        .then(res => res.json())
        .then(data => {
          if (data.chartData) {
            setChartData(data.chartData);
            setTodayStats(data.today);
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
          <h2 className="font-headline-lg text-on-surface">Attendance Overview</h2>
          <p className="text-on-surface-variant mt-1">Platform-wide attendance statistics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="font-headline-sm text-on-surface mb-6">Attendance Rate by Class</h3>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#777587" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#777587" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e8ea" />
                <Tooltip 
                  cursor={{ fill: '#f8f9fb' }}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`${value}%`, 'Attendance']}
                />
                <Bar dataKey="attendance" name="Attendance" fill="#3525cd" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-4">Daily Snapshot</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low">
                <span className="text-on-surface-variant text-sm">Present Today</span>
                <span className="font-bold text-primary">{todayStats.present}%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low">
                <span className="text-on-surface-variant text-sm">Absent Today</span>
                <span className="font-bold text-error">{todayStats.absent}%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low">
                <span className="text-on-surface-variant text-sm">Excused</span>
                <span className="font-bold text-secondary">{todayStats.excused}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}