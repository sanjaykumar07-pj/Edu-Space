import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function GET() {
  try {
    const response = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: {
        query: "SELECT * FROM Attendance"
      }
    });

    // We'll also fetch classes to map classIds to codes
    const classesResponse = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: { query: "SELECT ROWID, code FROM Classes" }
    });

    const classCodes = {};
    classesResponse.forEach(row => {
      classCodes[row.Classes.ROWID] = row.Classes.code;
    });

    // Group by class and calculate attendance rate
    const classStats = {};
    response.forEach(row => {
      const cid = row.Attendance.classId;
      if (!classStats[cid]) {
        classStats[cid] = { total: 0, present: 0 };
      }
      classStats[cid].total++;
      if (row.Attendance.method === 'Present') {
        classStats[cid].present++;
      }
    });

    const chartData = Object.keys(classStats).map(cid => ({
      name: classCodes[cid] || 'Unknown',
      attendance: Math.round((classStats[cid].present / classStats[cid].total) * 100)
    }));

    return NextResponse.json({
      chartData,
      today: { present: 94, absent: 4, excused: 2 } // Mocking daily snapshot for now
    });
  } catch (error) {
    console.error('Fetch attendance error:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}
