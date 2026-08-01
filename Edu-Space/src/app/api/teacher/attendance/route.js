import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const date = searchParams.get('date'); // YYYY-MM-DD
    const studentId = searchParams.get('studentId');

    let query = "SELECT * FROM Attendance WHERE ROWID != '0'"; // dummy true condition
    if (classId) query += " AND classId = '" + classId + "'";
    if (date) query += " AND attendanceDate = '" + date + "'";
    if (studentId) query += " AND studentId = '" + studentId + "'";

    const response = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: { query }
    });

    const records = response.map(row => ({
      id: row.Attendance.ROWID,
      classId: row.Attendance.classId,
      studentId: row.Attendance.studentId,
      method: row.Attendance.method,
      date: row.Attendance.attendanceDate
    }));

    return NextResponse.json(records);
  } catch (error) {
    console.error('Fetch attendance error:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { classId, attendanceData, date } = body; // attendanceData: array of { studentId, method }

    const rows = attendanceData.map(record => ({
      classId,
      studentId: record.studentId,
      method: record.method,
      attendanceDate: date
    }));

    const response = await callCatalystTool('CatalystbyZoho_Insert_Rows', {
      body: rows,
      path_variables: {
        id: "58391000000029001" // Attendance table ID
      }
    });

    return NextResponse.json({ success: true, count: response.length });
  } catch (error) {
    console.error('Save attendance error:', error);
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 });
  }
}
