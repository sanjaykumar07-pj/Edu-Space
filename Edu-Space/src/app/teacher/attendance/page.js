"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import EmptyState from '@/components/EmptyState';

export default function Attendance() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // existingAttendance: holds what is already in DB for this date/class
  const [attendanceData, setAttendanceData] = useState({}); // { studentId: method }
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      Promise.all([
        fetch(`/api/teacher/classes?teacherId=${user.id}`).then(res => res.json()),
        fetch(`/api/students`).then(res => res.json())
      ]).then(([clsData, stuData]) => {
        setClasses(clsData);
        setStudents(stuData);
        if (clsData.length > 0) setSelectedClassId(clsData[0].id);
      }).catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (user && selectedClassId && selectedDate) {
      setLoading(true);
      fetch(`/api/teacher/attendance?teacherId=${user.id}&classId=${selectedClassId}&date=${selectedDate}`)
        .then(res => res.json())
        .then(data => {
          const map = {};
          if (Array.isArray(data)) {
            data.forEach(record => {
              map[record.studentId] = record.method;
            });
          }
          setAttendanceData(map);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user, selectedClassId, selectedDate]);

  const handleMark = (studentId, method) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: method }));
  };

  const handleSave = async () => {
    if (!selectedClassId || !selectedDate) return;
    
    setSaving(true);
    
    // Convert map to array format for API
    const arr = Object.keys(attendanceData).map(studentId => ({
      studentId,
      method: attendanceData[studentId]
    }));

    try {
      await fetch('/api/teacher/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClassId,
          teacherId: user.id,
          date: selectedDate,
          attendanceData: arr
        })
      });
      alert('Attendance saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const currentClass = classes.find(c => c.id === selectedClassId);
  // Get student objects for the enrolled student IDs
  const enrolledStudents = currentClass 
    ? students.filter(s => currentClass.studentIds.includes(s.id))
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">Attendance</h2>
          <p className="text-on-surface-variant mt-1">Mark daily attendance for your classes.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-on-surface mb-2">Select Class</label>
            <select 
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface"
            >
              {classes.length === 0 && <option value="" disabled>No classes assigned</option>}
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
              ))}
            </select>
          </div>
          <div className="md:w-48">
            <label className="block text-sm font-semibold text-on-surface mb-2">Date</label>
            <input 
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : !currentClass ? (
          <EmptyState icon="class" title="Select a class" description="Please select a class to mark attendance." />
        ) : enrolledStudents.length === 0 ? (
          <EmptyState icon="group_off" title="No Students" description="There are no students enrolled in this class yet." />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-[1fr_auto] gap-4 p-4 border-b border-surface-container-high bg-surface-container-low font-label-md text-on-surface-variant uppercase tracking-wider text-xs rounded-t-xl">
              <div>Student Name</div>
              <div className="w-64 text-center">Status</div>
            </div>
            
            <div className="flex flex-col divide-y divide-surface-container-high">
              {enrolledStudents.map(student => {
                const status = attendanceData[student.id] || '';
                return (
                  <div key={student.id} className="grid grid-cols-[1fr_auto] gap-4 p-4 items-center hover:bg-surface-container transition-colors">
                    <div className="font-label-md text-on-surface">{student.name}</div>
                    <div className="w-64 flex bg-surface border border-surface-container-high rounded-lg overflow-hidden">
                      <button 
                        onClick={() => handleMark(student.id, 'Present')}
                        className={`flex-1 py-2 text-sm font-semibold transition-colors ${status === 'Present' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-high text-on-surface-variant'}`}
                      >
                        Present
                      </button>
                      <button 
                        onClick={() => handleMark(student.id, 'Absent')}
                        className={`flex-1 py-2 text-sm font-semibold transition-colors ${status === 'Absent' ? 'bg-error text-on-error' : 'hover:bg-surface-container-high text-on-surface-variant'}`}
                      >
                        Absent
                      </button>
                      <button 
                        onClick={() => handleMark(student.id, 'Excused')}
                        className={`flex-1 py-2 text-sm font-semibold transition-colors ${status === 'Excused' ? 'bg-secondary text-on-secondary' : 'hover:bg-surface-container-high text-on-surface-variant'}`}
                      >
                        Excused
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 mt-6 border-t border-surface-container-high flex justify-end">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-primary text-on-primary font-label-md rounded-xl hover:bg-primary-container disabled:opacity-50 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">save</span>
                )}
                Save Attendance
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
