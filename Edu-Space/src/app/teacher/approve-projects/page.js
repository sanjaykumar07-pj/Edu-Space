"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';

export default function ApproveProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadProjects();
  }, [user]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      await loadProjects();
    } catch (err) {
      console.error(err);
      alert('Failed to update project status.');
    }
  };

  if (!user) return null;

  const pendingProjects = projects.filter(p => p.status === 'Pending' || p.status === 'Submitted');
  const reviewedProjects = projects.filter(p => p.status === 'Approved' || p.status === 'Rejected');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">Approve Projects</h2>
          <p className="text-on-surface-variant mt-1">Review student submissions and assign grades.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="font-headline-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">pending_actions</span>
              Needs Review
            </h3>
            {pendingProjects.map(p => (
              <div key={p.id} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-secondary/30 relative">
                <div className="mb-3">
                  <h4 className="font-title-md text-on-surface">{p.title}</h4>
                  <p className="text-sm text-on-surface-variant">Submitted by <span className="font-semibold text-on-surface">{p.studentName}</span></p>
                </div>
                <p className="text-sm text-on-surface-variant mb-4">{p.description}</p>
                {p.link && (
                  <Link href={p.link} target="_blank" className="text-primary text-sm hover:underline flex items-center gap-1 mb-4">
                    <span className="material-symbols-outlined text-[16px]">link</span>
                    View Submission
                  </Link>
                )}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(p.id, 'Approved')}
                    className="flex-1 py-2 bg-primary text-on-primary font-label-md rounded-lg hover:bg-primary-container transition-colors"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(p.id, 'Rejected')}
                    className="flex-1 py-2 bg-surface text-on-surface font-label-md rounded-lg border border-surface-container-high hover:bg-error-container hover:text-on-error-container hover:border-transparent transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {pendingProjects.length === 0 && (
              <div className="bg-surface-container-lowest rounded-2xl p-8 border border-dashed border-surface-container-high text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 opacity-50">done_all</span>
                <p className="text-on-surface-variant text-sm">All caught up! No pending submissions.</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-headline-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">history</span>
              Recently Reviewed
            </h3>
            {reviewedProjects.map(p => (
              <div key={p.id} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container-high relative opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-title-md text-on-surface">{p.title}</h4>
                    <p className="text-sm text-on-surface-variant">by {p.studentName}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${p.status === 'Approved' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
                    {p.status}
                  </span>
                </div>
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={() => handleUpdateStatus(p.id, 'Pending')}
                    className="text-sm text-on-surface-variant hover:text-primary transition-colors hover:underline"
                  >
                    Undo Review
                  </button>
                </div>
              </div>
            ))}
            {reviewedProjects.length === 0 && (
              <div className="bg-surface-container-lowest rounded-2xl p-8 border border-dashed border-surface-container-high text-center">
                <p className="text-on-surface-variant text-sm">No recently reviewed projects.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
