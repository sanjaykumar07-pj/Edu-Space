"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Leaderboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('global');

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStudents(data);
        }
      })
      .catch(console.error);
  }, []);

  if (!user || students.length === 0) return null;

  const top3 = students.slice(0, 3);
  const rest = students.slice(3);

  // Reorder top 3 for podium (2nd, 1st, 3rd)
  const podium = [
    top3[1] || null,
    top3[0] || null,
    top3[2] || null
  ];

  const getRingColor = (index) => {
    if (index === 0) return 'ring-[#C0C0C0] shadow-[0_0_15px_rgba(192,192,192,0.5)]'; // Silver
    if (index === 1) return 'ring-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.6)]'; // Gold
    if (index === 2) return 'ring-[#CD7F32] shadow-[0_0_10px_rgba(205,127,50,0.4)]'; // Bronze
    return '';
  };

  const getRankBadge = (index) => {
    if (index === 0) return 'bg-[#C0C0C0] text-black';
    if (index === 1) return 'bg-[#FFD700] text-black';
    if (index === 2) return 'bg-[#CD7F32] text-white';
    return '';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-on-surface">Leaderboard</h2>
          <p className="text-on-surface-variant mt-1">See how you rank against your peers.</p>
        </div>
        
        <div className="flex bg-surface-container rounded-lg p-1">
          {['global', 'class', 'friends'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md font-label-md capitalize transition-colors ${filter === f ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Podium */}
      <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm flex items-end justify-center gap-4 md:gap-8 min-h-[300px]">
        {podium.map((student, idx) => {
          if (!student) return <div key={idx} className="w-24"></div>;
          
          const isFirst = idx === 1;
          const height = isFirst ? 'h-40' : idx === 0 ? 'h-32' : 'h-24';
          const delay = isFirst ? 0 : idx === 0 ? 0.1 : 0.2;
          
          return (
            <motion.div 
              key={student.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay }}
              className="flex flex-col items-center flex-1 max-w-[150px]"
            >
              <div className="relative mb-4">
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-headline-lg ring-4 ${getRingColor(idx)}`}>
                  {student.name.charAt(0)}
                </div>
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${getRankBadge(idx)} flex items-center justify-center font-bold text-sm border-2 border-surface-container-lowest`}>
                  {idx === 0 ? 2 : idx === 1 ? 1 : 3}
                </div>
                {isFirst && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl">
                    👑
                  </div>
                )}
              </div>
              
              <h4 className="font-headline-sm text-on-surface text-center truncate w-full mb-1">{student.name}</h4>
              <p className="font-label-md text-primary bg-primary-fixed/30 px-3 py-1 rounded-full">{student.xp} XP</p>
              
              <div className={`w-full ${height} bg-gradient-to-t from-surface-container to-surface-container-low rounded-t-xl mt-4 relative overflow-hidden flex justify-center pt-4`}>
                <span className="font-headline-xl text-outline/30">{idx === 0 ? 2 : idx === 1 ? 1 : 3}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* List */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 border-b border-surface-container-high bg-surface-container-low font-label-md text-on-surface-variant uppercase tracking-wider text-xs">
          <div className="w-12 text-center">Rank</div>
          <div>Student</div>
          <div className="w-24 text-center">Activities</div>
          <div className="w-24 text-right">XP</div>
        </div>
        
        <div className="flex flex-col divide-y divide-surface-container-high">
          {rest.map((student, index) => {
            const rank = index + 4;
            const isMe = student.id === user.id;
            
            return (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (index * 0.05) }}
                key={student.id} 
                className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 items-center transition-colors ${isMe ? 'bg-primary-fixed/20 hover:bg-primary-fixed/30' : 'hover:bg-surface-container'}`}
              >
                <div className="w-12 text-center font-headline-sm text-on-surface-variant">
                  {rank}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-on-surface">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-label-md text-on-surface block">{student.name}</span>
                    {isMe && <span className="text-[10px] uppercase font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded mt-0.5 inline-block">You</span>}
                  </div>
                </div>
                <div className="w-24 text-center flex items-center justify-center gap-1 text-secondary font-label-md">
                  <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
                  {student.quizzesCompleted + student.projectsApproved}
                </div>
                <div className="w-24 text-right font-headline-sm text-on-surface">
                  {student.xp}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
