import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function GET() {
  try {
    const response = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: {
        query: "SELECT ROWID, name, email FROM Users WHERE role = 'student'"
      }
    });
    
    const students = response.map(row => ({
      id: row.Users.ROWID,
      name: row.Users.name,
      email: row.Users.email
    }));

    return NextResponse.json(students);
  } catch (error) {
    console.error('Fetch students error:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
