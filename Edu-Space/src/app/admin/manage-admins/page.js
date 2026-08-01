"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function ManageAdmins() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const loadData = async () => {
    try {
      const res = await fetch('/api/admins');
      const data = await res.json();
      setAdmins(data);
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
    if (newName) {
      await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newName, 
          phone: newPhone 
        })
      });
      await loadData();
      setShowModal(false);
      setNewName('');
      setNewPhone('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/admins/${id}`, { method: 'DELETE' });
    await loadData();
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">Manage Admins</h2>
          <p className="text-on-surface-variant mt-1">Add and remove admin accounts.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-on-primary px-6 py-2 rounded-xl font-label-md hover:bg-primary-container transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
          Add Admin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.map(admin => (
          <div key={admin.id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high relative group">
            <button 
              onClick={() => handleDelete(admin.id)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-error-container text-on-surface-variant hover:text-error transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-error-container text-on-error-container flex items-center justify-center">
                <span className="material-symbols-outlined">shield_person</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-on-surface leading-tight">{admin.name}</h3>
                <span className="bg-surface-container text-on-surface text-xs font-bold px-2 py-0.5 rounded mt-1 inline-block">{admin.email}</span>
              </div>
            </div>
            
            <div className="space-y-2 mt-6 border-t border-surface-container-high pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">call</span> Phone</span>
                <span className="font-semibold text-on-surface">{admin.phone || '-'}</span>
              </div>
            </div>
          </div>
        ))}
        {admins.length === 0 && (
          <div className="col-span-full p-8 text-center text-on-surface-variant bg-surface-container-lowest rounded-2xl border border-dashed border-surface-container-high">
            No admins found. Add one to get started.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xl w-full max-w-md">
            <h3 className="font-headline-sm text-on-surface mb-4">Add New Admin</h3>
            <form onSubmit={handleAdd}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-on-surface mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Admin Sarah"
                  required
                  autoFocus
                />
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
                  Add Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
