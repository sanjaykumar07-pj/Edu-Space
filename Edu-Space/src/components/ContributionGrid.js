"use client";

import { useMemo, useState, useEffect } from 'react';

export default function ContributionGrid() {
  const cols = 20;
  const rows = 5;
  const intensities = ['bg-surface-container', 'bg-primary/20', 'bg-primary/40', 'bg-primary/70', 'bg-primary'];

  const [extraActivity, setExtraActivity] = useState(0);

  useEffect(() => {
    const handleActivity = () => {
      setExtraActivity(prev => prev + 1);
    };
    window.addEventListener('xp-earned', handleActivity);
    return () => window.removeEventListener('xp-earned', handleActivity);
  }, []);

  const gridData = useMemo(() => {
    const data = [];
    for (let c = 0; c < cols; c++) {
      const column = [];
      for (let r = 0; r < rows; r++) {
        const weight = (c / cols) * 2;
        const rand = Math.random() + weight;
        let intensityIndex = 0;
        
        if (rand > 2.5) intensityIndex = 4;
        else if (rand > 1.8) intensityIndex = 3;
        else if (rand > 1.0) intensityIndex = 2;
        else if (rand > 0.4) intensityIndex = 1;
        
        if (c >= cols - 3 && r < 4) {
          intensityIndex = Math.max(intensityIndex, Math.floor(Math.random() * 2) + 3);
        }
        
        column.push(intensityIndex);
      }
      data.push(column);
    }
    
    for (let i = 0; i < extraActivity; i++) {
       const randomCol = Math.floor(Math.random() * 3) + (cols - 3);
       const randomRow = Math.floor(Math.random() * rows);
       data[randomCol][randomRow] = Math.min(4, data[randomCol][randomRow] + 2);
    }
    
    return data;
  }, [extraActivity]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 overflow-hidden">
        {gridData.map((column, cIndex) => (
          <div key={`col-${cIndex}`} className="flex flex-col gap-1">
            {column.map((intensity, rIndex) => (
              <div 
                key={`cell-${cIndex}-${rIndex}`}
                className={`w-3 h-3 rounded-[2px] ${intensities[intensity]} hover:ring-1 hover:ring-primary/50 cursor-pointer transition-all duration-200 hover:scale-125 z-10`}
                title="Activity level"
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 text-xs text-on-surface-variant mt-2">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-surface-container"></div>
        <div className="w-3 h-3 rounded-sm bg-primary/20"></div>
        <div className="w-3 h-3 rounded-sm bg-primary/40"></div>
        <div className="w-3 h-3 rounded-sm bg-primary/70"></div>
        <div className="w-3 h-3 rounded-sm bg-primary"></div>
        <span>More</span>
      </div>
    </div>
  );
}
