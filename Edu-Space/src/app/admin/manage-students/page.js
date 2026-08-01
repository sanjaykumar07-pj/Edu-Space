"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function ManageStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBranch, setNewBranch] = useState('');
  const [newDegree, setNewDegree] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const loadData = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
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
    if (newName && newBranch && newDegree) {
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newName, 
          branch: newBranch, 
          degree: newDegree, 
          phone: newPhone 
        })
      });
      await loadData();
      setShowModal(false);
      setNewName('');
      setNewBranch('');
      setNewDegree('');
      setNewPhone('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/students/${id}`, { method: 'DELETE' });
    await loadData();
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">Manage Students</h2>
          <p className="text-on-surface-variant mt-1">Add and remove student accounts.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-on-primary px-6 py-2 rounded-xl font-label-md hover:bg-primary-container transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Add Student
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map(student => (
          <div key={student.id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high relative group">
            <button 
              onClick={() => handleDelete(student.id)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-error-container text-on-surface-variant hover:text-error transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined">school</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-on-surface leading-tight">{student.name}</h3>
                <span className="bg-surface-container text-on-surface text-xs font-bold px-2 py-0.5 rounded mt-1 inline-block">{student.email}</span>
              </div>
            </div>
            
            <div className="space-y-2 mt-6 border-t border-surface-container-high pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">menu_book</span> Degree</span>
                <span className="font-semibold text-on-surface">{student.degree || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">account_tree</span> Branch</span>
                <span className="font-semibold text-on-surface">{student.branch || '-'}</span>
              </div>
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <div className="col-span-full p-8 text-center text-on-surface-variant bg-surface-container-lowest rounded-2xl border border-dashed border-surface-container-high">
            No students found. Add one to get started.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xl w-full max-w-md">
            <h3 className="font-headline-sm text-on-surface mb-4">Add New Student</h3>
            <form onSubmit={handleAdd}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-on-surface mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. John Doe"
                  required
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">Degree</label>
                  <input 
                    type="text" 
                    value={newDegree}
                    onChange={e => setNewDegree(e.target.value)}
                    className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. B.Tech"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">Branch</label>
                  <input 
                    type="text" 
                    value={newBranch}
                    onChange={e => setNewBranch(e.target.value)}
                    className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. CSE"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-on-surface mb-2">Phone (Optional)</label>
                <input 
                  type="tel" 
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. +1234567890"
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
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
