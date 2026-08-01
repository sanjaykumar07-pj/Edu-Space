"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useReward } from '@/contexts/RewardContext';
import { REWARDS } from '@/lib/rewardLogic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MeetingRoom({ params }) {
  const { id } = params;
  const { user } = useAuth();
  const { awardXP } = useReward();
  const router = useRouter();
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (user && !joined) {
      setJoined(true);
      // Auto-award XP on join
      awardXP(REWARDS.MEETING_JOINED.amount, REWARDS.MEETING_JOINED.reason);
    }
  }, [user, joined, awardXP]);

  if (!user) return null;

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-140px)]">
      <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-2xl shadow-sm">
        <div>
          <h2 className="font-headline-sm text-on-surface">Live Class Session</h2>
          <p className="text-on-surface-variant text-sm">Room: EduSpace-{id}</p>
        </div>
        <button 
          onClick={() => router.push('/student/meetings')}
          className="bg-error-container text-on-error-container px-6 py-2 rounded-xl font-label-md hover:bg-error/20 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">call_end</span>
          Leave
        </button>
      </div>

      <div className="flex-1 bg-black rounded-2xl overflow-hidden shadow-xl relative">
        <iframe
          src={`https://meet.jit.si/EduSpace-${id}#config.prejoinPageEnabled=false&userInfo.displayName="${encodeURIComponent(user.name)}"`}
          allow="camera; microphone; fullscreen; display-capture"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
