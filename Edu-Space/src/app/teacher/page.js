"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user && user.id) {
      Promise.all([
        fetch(`/api/teacher/classes?teacherId=${user.id}`).then(res => res.json()),
        fetch(`/api/projects`).then(res => res.json())
      ]).then(([clsData, projData]) => {
        setClasses(clsData || []);
        const pending = (projData || []).filter(p => p.status === 'Pending' || p.status === 'Submitted');
        setPendingCount(pending.length);
      }).catch(console.error);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-on-surface-variant font-body-sm mb-1 uppercase tracking-wider">Total Students</p>
            <h3 className="text-on-surface font-headline-xl">45</h3>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-2xl">analytics</span>
            </div>
            <div className="flex items-center gap-1 bg-secondary-container/20 px-2 py-1 rounded-full text-secondary font-label-md">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              +2.5%
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-on-surface-variant font-body-sm mb-1 uppercase tracking-wider">Avg Class Score</p>
            <h3 className="text-on-surface font-headline-xl">82%</h3>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border border-tertiary-container">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-2xl animate-pulse">new_releases</span>
            </div>
            {pendingCount > 0 && (
              <div className="flex items-center gap-1 bg-error-container text-on-error-container px-2 py-1 rounded-full font-label-md animate-pulse">
                Action Required
              </div>
            )}
          </div>
          <div className="relative z-10">
            <p className="text-on-surface-variant font-body-sm mb-1 uppercase tracking-wider">Pending Projects</p>
            <h3 className="text-on-surface font-headline-xl">{pendingCount}</h3>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-2xl">event_available</span>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-on-surface-variant font-body-sm mb-1 uppercase tracking-wider">Attendance Rate</p>
            <h3 className="text-on-surface font-headline-xl">94%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-on-surface">My Classes</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classes.map(c => (
                <div key={c.id} className="border border-surface-container-high rounded-xl p-5 hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-headline-sm text-on-surface">{c.name}</h4>
                    <span className="bg-surface-container text-on-surface text-xs font-bold px-2 py-1 rounded">{c.code}</span>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-4">{c.studentIds.length} Students</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed border-2 border-surface-container-lowest flex items-center justify-center text-xs">A</div>
                      <div className="w-8 h-8 rounded-full bg-secondary-fixed border-2 border-surface-container-lowest flex items-center justify-center text-xs">S</div>
                      <div className="w-8 h-8 rounded-full bg-tertiary-fixed border-2 border-surface-container-lowest flex items-center justify-center text-xs">J</div>
                    </div>
                    <Link href={`/teacher/classes/${c.id}`} className="text-primary text-sm font-semibold hover:underline">
                      View Class
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-6">Recent Activity</h3>
            <div className="flex flex-col gap-4 relative">
              <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-surface-container-high"></div>
              
              <div className="flex gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center border-4 border-surface-container-lowest shrink-0">
                  <span className="material-symbols-outlined text-sm">cloud_upload</span>
                </div>
                <div className="bg-surface-container-low rounded-xl p-4 flex-1">
                  <p className="font-body-sm text-on-surface"><span className="font-bold">Alex Johnson</span> submitted a project: &quot;Math Portfolio&quot;</p>
                  <p className="text-xs text-on-surface-variant mt-1">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center border-4 border-surface-container-lowest shrink-0">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                </div>
                <div className="bg-surface-container-low rounded-xl p-4 flex-1">
                  <p className="font-body-sm text-on-surface"><span className="font-bold">Sam Lee</span> completed quiz &quot;Algebra Basics&quot; (Score: 50%)</p>
                  <p className="text-xs text-on-surface-variant mt-1">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <Link href="/teacher/create-quiz" className="flex items-center gap-3 p-3 rounded-xl border border-surface-container-high hover:border-primary hover:bg-primary-fixed/5 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">auto_fix</span>
                </div>
                <div>
                  <h4 className="font-label-md text-on-surface">Generate AI Quiz</h4>
                  <p className="text-xs text-on-surface-variant">Create a quiz in seconds</p>
                </div>
              </Link>
              
              <Link href="/teacher/live-session" className="flex items-center gap-3 p-3 rounded-xl border border-surface-container-high hover:border-secondary hover:bg-secondary-fixed/10 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">live_tv</span>
                </div>
                <div>
                  <h4 className="font-label-md text-on-surface">Host Live Session</h4>
                  <p className="text-xs text-on-surface-variant">Start an interactive class</p>
                </div>
              </Link>

              <Link href="/teacher/approve-projects" className="flex items-center gap-3 p-3 rounded-xl border border-surface-container-high hover:border-tertiary hover:bg-tertiary-fixed/10 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">approval</span>
                </div>
                <div>
                  <h4 className="font-label-md text-on-surface">Review Projects</h4>
                  <p className="text-xs text-on-surface-variant">{pendingCount} pending approvals</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
