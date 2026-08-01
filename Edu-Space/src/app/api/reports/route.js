import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let csvContent = "";

    if (type === 'Grades Report') {
      const response = await callCatalystTool('CatalystbyZoho_Execute_Query', {
        body: { query: "SELECT ROWID, name, avg_score FROM Classes" }
      });
      csvContent = "Class ID,Class Name,Average Score\n";
      response.forEach(row => {
        csvContent += `${row.Classes.ROWID},${row.Classes.name},${row.Classes.avg_score || 0}\n`;
      });
    } else if (type === 'Engagement Report') {
      const response = await callCatalystTool('CatalystbyZoho_Execute_Query', {
        body: { query: "SELECT ROWID, name, role FROM Users WHERE role = 'student'" }
      });
      csvContent = "Student ID,Name,Role,Total XP (Mock),Active Streaks (Mock)\n";
      response.forEach(row => {
        const xp = Math.floor(Math.random() * 5000);
        const streak = Math.floor(Math.random() * 30);
        csvContent += `${row.Users.ROWID},${row.Users.name},${row.Users.role},${xp},${streak}\n`;
      });
    } else if (type === 'Attendance Report') {
      const response = await callCatalystTool('CatalystbyZoho_Execute_Query', {
        body: { query: "SELECT ROWID, classId, method, attendanceDate FROM Attendance" }
      });
      csvContent = "Attendance ID,Class ID,Method,Date\n";
      response.forEach(row => {
        csvContent += `${row.Attendance.ROWID},${row.Attendance.classId},${row.Attendance.method},${row.Attendance.attendanceDate}\n`;
      });
    } else {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${type.replace(/\s+/g, '_')}.csv"`,
      },
    });
  } catch (error) {
    console.error('Fetch report error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
