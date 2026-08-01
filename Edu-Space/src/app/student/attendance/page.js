"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function Attendance() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetch('/api/classes').then(res => res.json()),
        fetch(`/api/teacher/attendance?studentId=${user.id}`).then(res => res.json())
      ]).then(([clsData, attData]) => {
        if (Array.isArray(clsData)) setClasses(clsData.filter(c => c.studentIds.includes(user.id)));
        if (Array.isArray(attData)) setAttendanceRecords(attData);
      }).catch(console.error);
    }
  }, [user]);

  const getAttendanceSummary = (classId) => {
    const records = attendanceRecords.filter(r => r.classId === classId);
    if (records.length === 0) return 100; // default 100%
    const present = records.filter(r => r.method === 'Present' || r.method === 'Face_ID' || r.method === 'Bluetooth').length;
    return Math.round((present / records.length) * 100);
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">My Attendance</h2>
          <p className="text-on-surface-variant mt-1">Track your presence across all classes.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
        <h3 className="font-headline-sm text-on-surface mb-6">Attendance Summary</h3>
        <div className="flex flex-col gap-4">
          {classes.map(c => {
            const pct = getAttendanceSummary(c.id);
            return (
              <div key={c.id} className="border border-surface-container-high rounded-xl p-5 flex items-center justify-between hover:border-primary/50 transition-colors">
                <div>
                  <h4 className="font-headline-sm text-on-surface">{c.name}</h4>
                  <p className="text-on-surface-variant font-body-sm">{c.code}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-headline-md text-primary">{pct}%</p>
                    <p className="text-xs text-on-surface-variant">Present</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent border-l-transparent transform rotate-45" style={{ borderColor: pct < 75 ? '#ba1a1a' : '#3525cd' }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
