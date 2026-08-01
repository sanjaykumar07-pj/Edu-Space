"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Settings() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('sk-ant-mock-key-*******************');
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [gamification, setGamification] = useState(true);
  const [academicYear, setAcademicYear] = useState('2026-2027');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-lg text-on-surface">Platform Settings</h2>
          <p className="text-on-surface-variant mt-1">Configure global platform behavior.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high">
          <h3 className="font-headline-sm text-on-surface mb-6 flex items-center gap-2 border-b border-surface-container-high pb-4">
            <span className="material-symbols-outlined text-primary">integration_instructions</span>
            API Integrations
          </h3>
          
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">Anthropic API Key (Claude AI)</label>
            <p className="text-xs text-on-surface-variant mb-2">Used for generating dynamic quizzes in the Teacher dashboard.</p>
            <input 
              type="password" 
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm"
            />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high">
          <h3 className="font-headline-sm text-on-surface mb-6 flex items-center gap-2 border-b border-surface-container-high pb-4">
            <span className="material-symbols-outlined text-secondary">tune</span>
            Platform Features
          </h3>
          
          <div className="flex flex-col gap-6">
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <span className="block text-sm font-semibold text-on-surface">Enable Gamification System</span>
                <span className="text-xs text-on-surface-variant">Turn on XP, Streaks, and Leaderboards platform-wide.</span>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${gamification ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${gamification ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
              {/* Hidden actual checkbox for accessibility */}
              <input type="checkbox" className="hidden" checked={gamification} onChange={() => setGamification(!gamification)} />
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <span className="block text-sm font-semibold text-on-surface">Allow Open Registration</span>
                <span className="text-xs text-on-surface-variant">Allow students to sign up without an admin invite code.</span>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${allowRegistration ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${allowRegistration ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
              <input type="checkbox" className="hidden" checked={allowRegistration} onChange={() => setAllowRegistration(!allowRegistration)} />
            </label>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">Current Academic Year</label>
              <select 
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                className="w-1/2 bg-surface border border-surface-container-high rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="2025-2026">2025-2026</option>
                <option value="2026-2027">2026-2027</option>
                <option value="2027-2028">2027-2028</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-2">
          <button type="button" className="px-6 py-3 rounded-xl font-label-md text-on-surface-variant hover:bg-surface-container-highest transition-colors">
            Discard Changes
          </button>
          <button type="submit" className="px-8 py-3 rounded-xl font-label-md bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-md">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}