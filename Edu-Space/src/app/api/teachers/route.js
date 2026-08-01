import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function GET() {
  try {
    const response = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: {
        query: "SELECT * FROM Users WHERE role = 'teacher'"
      }
    });
    
    // The query tool returns an array of objects like { "Users": { ROWID: ..., name: ... } }
    const teachers = response.map(row => ({
      id: row.Users.ROWID,
      name: row.Users.name,
      email: row.Users.email,
      role: row.Users.role,
      branch: row.Users.branch,
      degree: row.Users.degree,
      phone: row.Users.phone
    }));

    return NextResponse.json(teachers);
  } catch (error) {
    console.error('Fetch teachers error:', error);
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, branch, degree, phone } = body;
    
    // Generate a placeholder email and password for teacher
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}@edu-space.com`;
    const password = "password123";

    const response = await callCatalystTool('CatalystbyZoho_Insert_Rows', {
      body: [
        { name, email, password, role: 'teacher', branch, degree, phone }
      ],
      path_variables: {
        id: "58391000000016001" // Users table ID
      }
    });

    return NextResponse.json({ success: true, id: response[0].ROWID });
  } catch (error) {
    console.error('Add teacher error:', error);
    return NextResponse.json({ error: 'Failed to add teacher' }, { status: 500 });
  }
}
