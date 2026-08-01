"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';

export default function MyClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [className, setClassName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [saving, setSaving] = useState(false);

  const loadClasses = () => {
    if (user && user.id) {
      setLoading(true);
      fetch(`/api/teacher/classes?teacherId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) setClasses(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    loadClasses();
  }, [user]);

  const handleSaveClass = async (e) => {
    e.preventDefault();
    if (className && classCode) {
      setSaving(true);
      try {
        await fetch('/api/classes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: className,
            code: classCode,
            teacherId: user.id
          })
        });
        
        setShowModal(false);
        setClassName('');
        setClassCode('');
        loadClasses();
      } catch (error) {
        console.error('Error creating class:', error);
        alert('Failed to create class');
      } finally {
        setSaving(false);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">My Classes</h2>
          <p className="text-on-surface-variant mt-1">Manage your assigned courses and students.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-on-primary px-6 py-2 rounded-xl font-label-md hover:bg-primary-container transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Class
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map(c => (
            <div key={c.id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high relative group flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-on-surface leading-tight">{c.name}</h3>
                  <span className="bg-surface-container text-on-surface text-xs font-bold px-2 py-0.5 rounded mt-1 inline-block">{c.code}</span>
                </div>
              </div>
              
              <div className="space-y-2 mt-4 border-t border-surface-container-high pt-4 flex-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">group</span> Students Enrolled</span>
                  <span className="font-semibold text-on-surface">{c.studentIds.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">analytics</span> Average Score</span>
                  <span className="font-semibold text-primary">{c.avgScore}%</span>
                </div>
              </div>
              
              <div className="mt-6 flex gap-2">
                <Link href="/teacher/attendance" className="flex-1 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md rounded-xl text-center transition-colors">
                  Attendance
                </Link>
                <Link href="/teacher/create-quiz" className="flex-1 py-2 bg-primary text-on-primary hover:bg-primary-container font-label-md rounded-xl text-center transition-colors">
                  New Quiz
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12">
          <EmptyState icon="class" title="No Classes" description="You have not created any classes yet. Click 'Create Class' to get started." />
        </div>
      )}

      {/* Create Class Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xl w-full max-w-md">
            <h3 className="font-headline-sm text-on-surface mb-4">Create New Class</h3>
            <form onSubmit={handleSaveClass} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">Class Name</label>
                <input 
                  type="text" 
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface"
                  placeholder="e.g. Advanced Physics"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">Class Code</label>
                <input 
                  type="text" 
                  value={classCode}
                  onChange={e => setClassCode(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface"
                  placeholder="e.g. PHY-201"
                  required
                />
              </div>
              
              <div className="flex gap-3 justify-end pt-4 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-xl font-label-md text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl font-label-md bg-primary text-on-primary hover:bg-primary-container disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}