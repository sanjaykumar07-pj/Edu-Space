"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ManageTeachers() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [branch, setBranch] = useState('');
  const [degree, setDegree] = useState('');
  const [phone, setPhone] = useState('');
  const [mounted, setMounted] = useState(false);

  const loadTeachers = async () => {
    try {
      const res = await fetch('/api/teachers');
      const data = await res.json();
      setTeachers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (user) loadTeachers();
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newTeacherName) {
      await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTeacherName, branch, degree, phone })
      });
      await loadTeachers();
      setShowModal(false);
      setNewTeacherName('');
      setBranch('');
      setDegree('');
      setPhone('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
    await loadTeachers();
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">Manage Teachers</h2>
          <p className="text-on-surface-variant mt-1">Add or remove faculty members.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-on-primary px-6 py-2 rounded-xl font-label-md hover:bg-primary-container transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Add Teacher
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_auto] gap-4 p-4 border-b border-surface-container-high bg-surface-container-low font-label-md text-on-surface-variant uppercase tracking-wider text-xs">
          <div>Teacher</div>
          <div className="w-24 text-right">Actions</div>
        </div>
        
        <div className="flex flex-col divide-y divide-surface-container-high">
          {teachers.map(teacher => (
            <div key={teacher.id} className="grid grid-cols-[1fr_auto] gap-4 p-4 items-center hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center font-bold">
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <span className="font-label-md text-on-surface block">{teacher.name}</span>
                  <div className="text-xs text-on-surface-variant flex gap-3 mt-0.5">
                    <span>ID: {teacher.id}</span>
                    {teacher.branch && <span>• {teacher.branch}</span>}
                    {teacher.degree && <span>• {teacher.degree}</span>}
                    {teacher.phone && <span>• {teacher.phone}</span>}
                  </div>
                </div>
              </div>
              <div className="w-24 text-right flex justify-end">
                <button 
                  onClick={() => handleDelete(teacher.id)}
                  className="w-8 h-8 rounded-full hover:bg-error-container text-on-surface-variant hover:text-error transition-colors flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))}
          {teachers.length === 0 && (
            <div className="p-8 text-center text-on-surface-variant">
              No teachers found. Add one to get started.
            </div>
          )}
        </div>
      </div>

      {showModal && mounted && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline-sm text-on-surface mb-4">Add New Teacher</h3>
            <form onSubmit={handleAdd}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-on-surface mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={newTeacherName}
                  onChange={e => setNewTeacherName(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Jane Doe"
                  required
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-on-surface mb-2">Branch</label>
                <input 
                  type="text" 
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Computer Science"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-on-surface mb-2">Degree Completed</label>
                <input 
                  type="text" 
                  value={degree}
                  onChange={e => setDegree(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Ph.D. in AI"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-on-surface mb-2">Phone No.</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. +1 234 567 8900"
                  required
                />
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
                  className="px-6 py-2 rounded-xl font-label-md bg-primary text-on-primary hover:bg-primary-container"
                >
                  Save Teacher
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
