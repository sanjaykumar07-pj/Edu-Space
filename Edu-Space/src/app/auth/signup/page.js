"use client";

import { useState, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (name && email && password) {
      setIsLoading(true);
      try {
        await signup(role, name, email, password);
      } catch (err) {
        setError(err.message || 'An error occurred during sign up.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center mb-6 text-on-secondary-fixed shadow-sm">
        <span className="material-symbols-outlined text-3xl">
          {role === 'admin' ? 'admin_panel_settings' : role === 'teacher' ? 'co_present' : 'school'}
        </span>
      </div>
      <h1 className="font-headline-lg text-on-surface mb-2 capitalize">Join as {role}</h1>
      <p className="font-body-md text-on-surface-variant mb-8 text-center">Create a new account to get started.</p>

      {error && <div className="w-full bg-error-container text-on-error-container p-3 mb-4 rounded-xl text-sm text-center font-bold">{error}</div>}

      <form className="w-full space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block font-label-md text-on-surface mb-1" htmlFor="name">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
            <input 
              id="name" 
              type="text" 
              placeholder="Jane Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container-lowest border-2 border-surface-container-high rounded-xl py-3 pl-12 pr-4 font-body-md text-on-surface placeholder-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-label-md text-on-surface mb-1" htmlFor="email">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </div>
            <input 
              id="email" 
              type="email" 
              placeholder="you@school.edu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-lowest border-2 border-surface-container-high rounded-xl py-3 pl-12 pr-4 font-body-md text-on-surface placeholder-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-label-md text-on-surface mb-1" htmlFor="password">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[20px]">lock</span>
            </div>
            <input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-lowest border-2 border-surface-container-high rounded-xl py-3 pl-12 pr-4 font-body-md text-on-surface placeholder-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              required
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={!name || !email || !password}
          className="w-full py-3.5 bg-primary text-on-primary font-label-md rounded-xl hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center justify-center gap-2 group mt-2"
        >
          <span>Create Account</span>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-[18px]">person_add</span>
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-on-surface-variant font-body-sm">
          Already have an account?{' '}
          <Link href={`/auth/signin?role=${role}`} className="text-primary font-bold hover:underline">
            Sign In instead
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUp() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
