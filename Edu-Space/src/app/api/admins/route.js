import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function GET() {
  try {
    const response = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: {
        query: "SELECT * FROM Users WHERE role = 'admin'"
      }
    });
    
    const admins = response.map(row => ({
      id: row.Users.ROWID,
      name: row.Users.name,
      email: row.Users.email,
      role: row.Users.role,
      phone: row.Users.phone
    }));

    return NextResponse.json(admins);
  } catch (error) {
    console.error('Fetch admins error:', error);
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone } = body;
    
    // Generate a placeholder email and password for admin
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}@edu-space.com`;
    const password = "password123";

    const response = await callCatalystTool('CatalystbyZoho_Insert_Rows', {
      body: [
        { name, email, password, role: 'admin', phone }
      ],
      path_variables: {
        id: "58391000000016001" // Users table ID
      }
    });

    return NextResponse.json({ success: true, id: response[0].ROWID });
  } catch (error) {
    console.error('Add admin error:', error);
    return NextResponse.json({ error: 'Failed to add admin' }, { status: 500 });
  }
}
