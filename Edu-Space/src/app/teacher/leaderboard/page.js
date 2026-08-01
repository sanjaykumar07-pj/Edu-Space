"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import EmptyState from '@/components/EmptyState';

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/leaderboard')
        .then(res => res.json())
        .then(data => {
          setLeaderboard(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">Leaderboard</h2>
          <p className="text-on-surface-variant mt-1">Top performing students across the platform.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : leaderboard.length === 0 ? (
        <EmptyState icon="social_leaderboard" title="No Data Available" description="Students have not earned any XP yet." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-high overflow-hidden">
              <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 border-b border-surface-container-high bg-surface-container-low font-label-md text-on-surface-variant uppercase tracking-wider text-xs">
                <div className="w-8 text-center">#</div>
                <div>Student</div>
                <div className="w-24 text-right">Stats</div>
                <div className="w-24 text-right">XP</div>
              </div>
              <div className="flex flex-col divide-y divide-surface-container-high">
                {leaderboard.map((student, index) => (
                  <div key={student.id} className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 items-center hover:bg-surface-container transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-gray-200 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'text-on-surface-variant'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-title-md text-on-surface">{student.name}</h4>
                      <p className="text-xs text-on-surface-variant">{student.email}</p>
                    </div>
                    <div className="text-right text-xs text-on-surface-variant flex flex-col gap-1 items-end">
                      <span className="bg-surface-container-high px-2 rounded-full">{student.quizzesCompleted} Quizzes</span>
                      <span className="bg-surface-container-high px-2 rounded-full">{student.projectsApproved} Projects</span>
                    </div>
                    <div className="w-24 text-right">
                      <span className="font-bold text-primary">{student.xp.toLocaleString()}</span>
                      <span className="text-xs text-on-surface-variant ml-1">XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high">
              <h3 className="font-title-lg text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">trophy</span>
                Top Scholar
              </h3>
              {leaderboard.length > 0 && (
                <div className="text-center mt-2">
                  <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4 border-2 border-primary">
                    <span className="material-symbols-outlined text-4xl text-primary">person</span>
                  </div>
                  <h4 className="font-headline-sm text-on-surface">{leaderboard[0].name}</h4>
                  <p className="text-on-surface-variant mb-4">{leaderboard[0].email}</p>
                  <div className="inline-block bg-primary text-on-primary px-4 py-1.5 rounded-full font-bold shadow-sm">
                    {leaderboard[0].xp.toLocaleString()} XP
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
