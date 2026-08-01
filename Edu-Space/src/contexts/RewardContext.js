"use client";

import { createContext, useContext, useState, useCallback } from 'react';
import RewardToast from '@/components/RewardToast';

const RewardContext = createContext();

export function RewardProvider({ children }) {
  const [toast, setToast] = useState(null);

  const awardXP = useCallback((amount, reason) => {
    setToast({ amount, reason, id: Date.now() });
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('xp-earned', { detail: amount }));
    }
    
    // Auto clear after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  return (
    <RewardContext.Provider value={{ awardXP }}>
      {children}
      {toast && (
        <RewardToast 
          key={toast.id} 
          amount={toast.amount} 
          reason={toast.reason} 
        />
      )}
    </RewardContext.Provider>
  );
}

export function useReward() {
  return useContext(RewardContext);
}
