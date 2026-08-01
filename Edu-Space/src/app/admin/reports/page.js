"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Reports() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDownload = async (reportName) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports?type=${encodeURIComponent(reportName)}`);
      if (!response.ok) throw new Error('Failed to download report');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportName.replace(/\s+/g, '_')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
      alert(`Failed to download ${reportName}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">Data & Reports</h2>
          <p className="text-on-surface-variant mt-1">Export platform metrics for external analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high flex flex-col group hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center mb-4">
            <span className="material-symbols-outlined">school</span>
          </div>
          <h3 className="font-headline-sm text-on-surface mb-2">End of Term Grades</h3>
          <p className="text-on-surface-variant text-sm flex-1 mb-6">Complete breakdown of all student averages across all enrolled classes.</p>
          <button 
            onClick={() => handleDownload('Grades Report')}
            disabled={loading}
            className="w-full py-2 border border-primary text-primary font-label-md rounded-xl hover:bg-primary-fixed/20 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high flex flex-col group hover:border-secondary/50 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center mb-4">
            <span className="material-symbols-outlined">local_fire_department</span>
          </div>
          <h3 className="font-headline-sm text-on-surface mb-2">Student Engagement</h3>
          <p className="text-on-surface-variant text-sm flex-1 mb-6">Log of total XP earned, active streaks, and project submissions.</p>
          <button 
            onClick={() => handleDownload('Engagement Report')}
            disabled={loading}
            className="w-full py-2 border border-secondary text-secondary font-label-md rounded-xl hover:bg-secondary-fixed/20 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high flex flex-col group hover:border-tertiary/50 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center mb-4">
            <span className="material-symbols-outlined">event_available</span>
          </div>
          <h3 className="font-headline-sm text-on-surface mb-2">Attendance Records</h3>
          <p className="text-on-surface-variant text-sm flex-1 mb-6">Historical attendance data per class including absences and excuses.</p>
          <button 
            onClick={() => handleDownload('Attendance Report')}
            disabled={loading}
            className="w-full py-2 border border-tertiary text-tertiary font-label-md rounded-xl hover:bg-tertiary-fixed/20 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}