"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useReward } from '@/contexts/RewardContext';
import { REWARDS, calculateQuizXP } from '@/lib/rewardLogic';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Mock quiz data for the session
const MOCK_QUIZ = {
  id: 'quiz_1',
  title: 'Algebra Basics',
  questions: [
    { id: 'q1', question: 'What is x if 2x = 10?', options: ['2', '4', '5', '10'], correctIndex: 2, explanation: 'Divide both sides by 2.' },
    { id: 'q2', question: 'Expand (a+b)^2', options: ['a^2+b^2', 'a^2+2ab+b^2', 'a^2-2ab+b^2', '2a+2b'], correctIndex: 1, explanation: 'Use the binomial expansion formula.' }
  ]
};

export default function LiveQuizSession({ params }) {
  const { user } = useAuth();
  const { awardXP } = useReward();
  const router = useRouter();
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const question = MOCK_QUIZ.questions[currentQIndex];

  useEffect(() => {
    if (isAnswered || quizFinished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQIndex, isAnswered, quizFinished]);

  const handleTimeUp = () => {
    setIsAnswered(true);
    setSelectedAnswer(-1); // timeout
  };

  const handleSelectAnswer = (index) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    if (index === question.correctIndex) {
      setScore(s => s + 1);
      const xp = calculateQuizXP(1, user.streak);
      awardXP(xp, REWARDS.QUIZ_CORRECT.reason);
    }
  };

  const handleNext = () => {
    if (currentQIndex < MOCK_QUIZ.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      setQuizFinished(true);
      awardXP(REWARDS.QUIZ_COMPLETED.amount, REWARDS.QUIZ_COMPLETED.reason);
    }
  };

  if (!user) return null;

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-container-lowest rounded-2xl border border-surface-container-high max-w-2xl mx-auto">
        <div className="w-24 h-24 rounded-full bg-secondary-fixed flex items-center justify-center mb-6 text-secondary">
          <span className="material-symbols-outlined text-5xl">emoji_events</span>
        </div>
        <h2 className="font-headline-lg text-on-surface mb-2">Quiz Completed!</h2>
        <p className="font-body-lg text-on-surface-variant mb-8">
          You scored {score} out of {MOCK_QUIZ.questions.length}.
        </p>
        <button 
          onClick={() => router.push('/student')}
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md hover:bg-primary-container transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-headline-md text-on-surface">{MOCK_QUIZ.title}</h2>
          <p className="text-on-surface-variant text-sm">Question {currentQIndex + 1} of {MOCK_QUIZ.questions.length}</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">stars</span>
            <span className="font-headline-sm">{score * 10} XP</span>
          </div>
          <div className={`flex items-center gap-2 font-headline-sm px-4 py-2 rounded-lg ${timeLeft <= 5 ? 'bg-error-container text-on-error-container animate-pulse' : 'bg-surface-container text-on-surface'}`}>
            <span className="material-symbols-outlined">timer</span>
            00:{timeLeft.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Quiz Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentQIndex}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm flex flex-col min-h-[400px]"
            >
              <h3 className="font-headline-lg text-on-surface mb-8">
                {question.question}
              </h3>
              
              <div className="flex flex-col gap-4 mt-auto">
                {question.options.map((opt, i) => {
                  let stateClass = "border-surface-container-high hover:border-primary hover:bg-primary-fixed/5";
                  let icon = null;
                  
                  if (isAnswered) {
                    if (i === question.correctIndex) {
                      stateClass = "border-tertiary bg-tertiary-fixed/20 ring-2 ring-tertiary/50";
                      icon = <span className="material-symbols-outlined text-tertiary">check_circle</span>;
                    } else if (i === selectedAnswer) {
                      stateClass = "border-error bg-error-container/50 ring-2 ring-error/50";
                      icon = <span className="material-symbols-outlined text-error">cancel</span>;
                    } else {
                      stateClass = "border-surface-container-high opacity-50";
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => handleSelectAnswer(i)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left w-full ${stateClass}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center font-bold text-on-surface-variant">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="font-body-lg text-on-surface">{opt}</span>
                      </div>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 flex justify-end"
                >
                  <button 
                    onClick={handleNext}
                    className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md flex items-center gap-2 hover:bg-primary-container"
                  >
                    {currentQIndex < MOCK_QUIZ.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Side Panel */}
        <div className="flex flex-col gap-6">
          {/* Progress Tracker */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <h4 className="font-label-md text-on-surface mb-4">Quiz Progress</h4>
            <div className="grid grid-cols-5 gap-2">
              {MOCK_QUIZ.questions.map((_, i) => (
                <div 
                  key={i}
                  className={`h-2 rounded-full ${i < currentQIndex ? 'bg-primary' : i === currentQIndex ? 'bg-primary-fixed animate-pulse' : 'bg-surface-container'}`}
                />
              ))}
            </div>
          </div>
          
          {/* AI Helper (Only shows when answered wrong) */}
          <AnimatePresence>
            {isAnswered && selectedAnswer !== question.correctIndex && selectedAnswer !== -1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-secondary-container relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-6xl text-secondary">psychology</span>
                </div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined">lightbulb</span>
                  </div>
                  <h4 className="font-headline-sm text-on-surface">AI Explanation</h4>
                </div>
                <p className="font-body-sm text-on-surface-variant relative z-10">
                  {question.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
