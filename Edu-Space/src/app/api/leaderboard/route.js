import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function GET() {
  try {
    // Fetch students
    const usersRes = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: { query: "SELECT ROWID, name, email FROM Users WHERE role = 'student'" }
    });

    const students = {};
    usersRes.forEach(row => {
      students[row.Users.ROWID] = {
        id: row.Users.ROWID,
        name: row.Users.name,
        email: row.Users.email,
        xp: 0,
        quizzesCompleted: 0,
        projectsApproved: 0
      };
    });

    // Fetch Quiz Attempts
    const quizzesRes = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: { query: "SELECT studentId, score FROM QuizAttempts" }
    });
    
    quizzesRes.forEach(row => {
      const studentId = row.QuizAttempts.studentId;
      if (students[studentId]) {
        students[studentId].xp += (parseInt(row.QuizAttempts.score) || 0) * 10;
        students[studentId].quizzesCompleted += 1;
      }
    });

    // Fetch Projects
    const projectsRes = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: { query: "SELECT student_id, status FROM Projects" }
    });

    projectsRes.forEach(row => {
      const studentId = row.Projects.student_id;
      if (students[studentId] && row.Projects.status === 'Approved') {
        students[studentId].xp += 500;
        students[studentId].projectsApproved += 1;
      }
    });

    // Convert object to array and sort by XP descending
    const leaderboard = Object.values(students).sort((a, b) => b.xp - a.xp);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Fetch leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
