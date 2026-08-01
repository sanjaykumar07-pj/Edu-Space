import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    let query = "SELECT * FROM QuizAttempts";

    const response = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: { query }
    });

    let gradeTrend = [];
    
    if (!response || response.length === 0) {
      // Fallback to mock data if no real attempts exist yet
      gradeTrend = [
        { term: 'Week 1', score: 65, avg: 72 },
        { term: 'Week 2', score: 78, avg: 75 },
        { term: 'Week 3', score: 85, avg: 74 },
        { term: 'Week 4', score: 92, avg: 78 },
        { term: 'Week 5', score: 88, avg: 82 },
        { term: 'Week 6', score: 95, avg: 85 },
      ];
    } else {
      const sortedAttempts = response.sort((a, b) => a.QuizAttempts.attemptTimestamp - b.QuizAttempts.attemptTimestamp);
      const chunkSize = Math.ceil(sortedAttempts.length / 6);
      
      for (let i = 0; i < 6; i++) {
        const chunk = sortedAttempts.slice(i * chunkSize, (i + 1) * chunkSize);
        if (chunk.length > 0) {
          const avg = chunk.reduce((sum, item) => sum + item.QuizAttempts.score, 0) / chunk.length;
          
          let studentScore = avg; // Default to avg if student didn't take it
          if (studentId) {
            const studentChunk = chunk.filter(c => c.QuizAttempts.studentId === studentId);
            if (studentChunk.length > 0) {
              studentScore = studentChunk.reduce((sum, item) => sum + item.QuizAttempts.score, 0) / studentChunk.length;
            }
          }

          gradeTrend.push({ name: `Period ${i+1}`, score: Math.round(studentScore), avg: Math.round(avg) });
        } else {
          gradeTrend.push({ name: `Period ${i+1}`, score: 0, avg: 0 });
        }
      }
    }

    return NextResponse.json({ gradeTrend });
  } catch (error) {
    console.error('Fetch analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
