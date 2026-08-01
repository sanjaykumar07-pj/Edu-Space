"use client";

import { motion, AnimatePresence } from 'framer-motion';

export default function RewardToast({ amount, reason }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-surface-container-lowest border-2 border-secondary-container shadow-2xl rounded-2xl p-4"
      >
        <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed text-2xl">
          🚀
        </div>
        <div>
          <div className="font-headline-sm text-secondary-container">
            +{amount} XP
          </div>
          <div className="font-body-sm text-on-surface-variant">
            {reason}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
