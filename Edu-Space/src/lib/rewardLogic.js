export const REWARDS = {
  QUIZ_CORRECT: {
    amount: 10,
    reason: "Correct Answer"
  },
  QUIZ_COMPLETED: {
    amount: 25,
    reason: "Quiz Completed"
  },
  STREAK_BONUS: {
    amount: 5,
    reason: "Streak Bonus"
  },
  PROJECT_SUBMITTED: {
    amount: 20,
    reason: "Project Pushed"
  },
  PROJECT_APPROVED: {
    amount: 50,
    reason: "Project Approved"
  },
  EVENT_ATTENDED: {
    amount: 15,
    reason: "Event Attendance"
  },
  MEETING_JOINED: {
    amount: 5,
    reason: "Live Session Join"
  }
};

/**
 * Calculates XP for a quiz attempt based on correct answers and streak
 * @param {number} correctAnswers Count of correct answers
 * @param {number} currentStreak Current daily streak
 * @returns {number} Total XP earned
 */
export const calculateQuizXP = (correctAnswers, currentStreak) => {
  let xp = correctAnswers * REWARDS.QUIZ_CORRECT.amount;
  if (currentStreak > 0) {
    xp += REWARDS.STREAK_BONUS.amount;
  }
  return xp;
};
