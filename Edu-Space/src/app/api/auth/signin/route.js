import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function POST(request) {
  try {
    const { role, email, password } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing role, email, or password' }, { status: 400 });
    }

    // Authenticate user via Catalyst
    const query = `SELECT * FROM Users WHERE email = '${email}'`;
    let response = [];
    try {
      response = await callCatalystTool('CatalystbyZoho_Execute_Query', { body: { query } });
    } catch (err) {
      console.error("Database query failed:", err);
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }

    if (!response || response.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const userData = response[0].Users;

    if (userData.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (userData.role !== role) {
      return NextResponse.json({ error: `This email is registered as a ${userData.role}. Please sign in from the correct portal.` }, { status: 403 });
    }

    return NextResponse.json({
      message: 'Authenticated successfully',
      user: {
        id: userData.app_id,
        name: userData.name,
        role: userData.role,
        email: userData.email,
        xp: parseInt(userData.xp || 0),
        streak: parseInt(userData.streak || 0)
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
