"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function ManageClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassCode, setNewClassCode] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  const loadData = async () => {
    try {
      const [classesRes, teachersRes] = await Promise.all([
        fetch('/api/classes'),
        fetch('/api/teachers')
      ]);
      const classesData = await classesRes.json();
      const teachersData = await teachersRes.json();
      
      setClasses(classesData);
      setTeachers(teachersData);
      
      if (teachersData.length > 0 && !selectedTeacherId) {
        setSelectedTeacherId(teachersData[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newClassName && newClassCode && selectedTeacherId) {
      await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newClassName, code: newClassCode, teacherId: selectedTeacherId })
      });
      await loadData();
      setShowModal(false);
      setNewClassName('');
      setNewClassCode('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/classes/${id}`, { method: 'DELETE' });
    await loadData();
  };

  const getTeacherName = (id) => {
    const t = teachers.find(t => t.id === id);
    return t ? t.name : 'Unknown';
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">Manage Classes</h2>
          <p className="text-on-surface-variant mt-1">Create and manage courses.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-on-primary px-6 py-2 rounded-xl font-label-md hover:bg-primary-container transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add_box</span>
          Create Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(c => (
          <div key={c.id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high relative group">
            <button 
              onClick={() => handleDelete(c.id)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-error-container text-on-surface-variant hover:text-error transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">class</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-on-surface leading-tight">{c.name}</h3>
                <span className="bg-surface-container text-on-surface text-xs font-bold px-2 py-0.5 rounded mt-1 inline-block">{c.code}</span>
              </div>
            </div>
            
            <div className="space-y-2 mt-6 border-t border-surface-container-high pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">person</span> Teacher</span>
                <span className="font-semibold text-on-surface">{getTeacherName(c.teacherId)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">group</span> Students</span>
                <span className="font-semibold text-on-surface">{c.studentIds.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">analytics</span> Avg Score</span>
                <span className="font-semibold text-primary">{c.avgScore}%</span>
              </div>
            </div>
          </div>
        ))}
        {classes.length === 0 && (
          <div className="col-span-full p-8 text-center text-on-surface-variant bg-surface-container-lowest rounded-2xl border border-dashed border-surface-container-high">
            No classes found. Create one to get started.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xl w-full max-w-md">
            <h3 className="font-headline-sm text-on-surface mb-4">Create New Class</h3>
            <form onSubmit={handleAdd}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-on-surface mb-2">Class Name</label>
                <input 
                  type="text" 
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Advanced Biology"
                  required
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-on-surface mb-2">Class Code</label>
                <input 
                  type="text" 
                  value={newClassCode}
                  onChange={e => setNewClassCode(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. BIO201"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-on-surface mb-2">Assign Teacher</label>
                <select 
                  value={selectedTeacherId}
                  onChange={e => setSelectedTeacherId(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                >
                  <option value="" disabled>Select a teacher...</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                {teachers.length === 0 && (
                  <p className="text-xs text-error mt-1">Please add a teacher first in Manage Teachers.</p>
                )}
              </div>
              <div className="flex gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-xl font-label-md text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={teachers.length === 0}
                  className="px-6 py-2 rounded-xl font-label-md bg-primary text-on-primary hover:bg-primary-container disabled:opacity-50"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}