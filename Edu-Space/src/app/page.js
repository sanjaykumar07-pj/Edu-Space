"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function Login() {
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role && name.trim()) {
      login(role, name.trim());
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-gutter">
      <div className="flex flex-col w-full min-h-[calc(100vh-theme(spacing.gutter)*2)] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-container via-surface-bright to-primary-fixed opacity-40 -z-10 blur-3xl pointer-events-none"></div>
        <div className="w-full max-w-2xl bg-surface-container-lowest rounded-[2rem] shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6">
            <div className="w-24 h-24 bg-secondary-fixed/30 rounded-full blur-2xl"></div>
          </div>
          <div className="absolute bottom-0 left-0 p-6">
            <div className="w-32 h-32 bg-primary-fixed/30 rounded-full blur-2xl"></div>
          </div>
          
          <div className="p-8 md:p-12 flex flex-col items-center relative z-10">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-6 flex items-center justify-center bg-surface-container-lowest rounded-full shadow-sm relative overflow-hidden" style={{ width: '128px', height: '128px' }}>
                <img 
                  alt="Edu-Space Logo" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuChneJwOhhP0NDgKMg1HHwb7EQWPxHka2xdxO1CnQRDBE6qak6sNwfmN8LO2kU9dMrwtNap0_5TA9n8d-2nKGH81OR5WW5A8dhiwOPXWQatqaD49tDd5bVVoF55RED_NofchdHVknJWZ2MU58D08teycbsnGkTaY6CE2Zc_eWzCzhhgDaYCHKiZC3djngZQndIKg_3B8TZdDfN32GDVgvdFqOuB7IKPeSMjXHh-7UfCleam-YikBLCSRg"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }}
                />
              </div>
              <h1 className="font-headline-xl text-on-surface mb-3">Welcome to Edu-Space</h1>
              <p className="font-body-lg text-on-surface-variant">Your Space to Learn, Play & Build.</p>
            </div>
            
            <div className="w-full space-y-8">
              <div>
                <h2 className="font-headline-sm text-on-surface mb-4 text-center">Who are you?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Admin Role */}
                  <button 
                    onClick={() => setRole('admin')}
                    className={`role-card relative group flex flex-col items-center text-center p-6 bg-surface-container-lowest border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${role === 'admin' ? 'border-primary bg-primary-fixed/10 ring-2 ring-primary ring-offset-2' : 'border-surface-container-high hover:border-primary hover:bg-primary-fixed/10 hover:-translate-y-1 hover:shadow-lg'}`}
                  >
                    <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center mb-4 text-on-secondary-fixed transition-transform group-hover:scale-110">
                      <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                    </div>
                    <h3 className="font-label-md text-on-surface mb-1">Admin</h3>
                    <p className="font-body-sm text-on-surface-variant">Manage the school</p>
                    <div className={`absolute top-3 right-3 text-primary transition-opacity ${role === 'admin' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                    </div>
                  </button>

                  {/* Teacher Role */}
                  <button 
                    onClick={() => setRole('teacher')}
                    className={`role-card relative group flex flex-col items-center text-center p-6 bg-surface-container-lowest border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${role === 'teacher' ? 'border-primary bg-primary-fixed/10 ring-2 ring-primary ring-offset-2' : 'border-surface-container-high hover:border-primary hover:bg-primary-fixed/10 hover:-translate-y-1 hover:shadow-lg'}`}
                  >
                    <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-4 text-on-primary-fixed transition-transform group-hover:scale-110">
                      <span className="material-symbols-outlined text-3xl">co_present</span>
                    </div>
                    <h3 className="font-label-md text-on-surface mb-1">Teacher</h3>
                    <p className="font-body-sm text-on-surface-variant">Guide your classes</p>
                    <div className={`absolute top-3 right-3 text-primary transition-opacity ${role === 'teacher' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                    </div>
                  </button>

                  {/* Student Role */}
                  <button 
                    onClick={() => setRole('student')}
                    className={`role-card relative group flex flex-col items-center text-center p-6 bg-surface-container-lowest border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${role === 'student' ? 'border-primary bg-primary-fixed/10 ring-2 ring-primary ring-offset-2' : 'border-surface-container-high hover:border-primary hover:bg-primary-fixed/10 hover:-translate-y-1 hover:shadow-lg'}`}
                  >
                    <div className="w-16 h-16 rounded-full bg-tertiary-fixed flex items-center justify-center mb-4 text-on-tertiary-fixed transition-transform group-hover:scale-110">
                      <span className="material-symbols-outlined text-3xl">school</span>
                    </div>
                    <h3 className="font-label-md text-on-surface mb-1">Student</h3>
                    <p className="font-body-sm text-on-surface-variant">Ready to learn</p>
                    <div className={`absolute top-3 right-3 text-primary transition-opacity ${role === 'student' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="w-full h-px bg-surface-container-high my-8"></div>

              <button 
                onClick={() => {
                  if (role) {
                    window.location.href = `/auth/signin?role=${role}`;
                  }
                }}
                disabled={!role}
                className="w-full py-4 bg-primary text-on-primary font-label-md rounded-xl hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Continue to Sign In</span>
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
