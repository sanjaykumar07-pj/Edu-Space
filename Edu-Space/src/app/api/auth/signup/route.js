import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function POST(request) {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const query = `SELECT * FROM Users WHERE email = '${email}'`;
    let existingUser = [];
    try {
      const response = await callCatalystTool('CatalystbyZoho_Execute_Query', { body: { query } });
      existingUser = response;
    } catch (err) {
      // It's possible the query fails if the table is empty or error occurs, we assume empty for now.
      console.warn("Query check failed, assuming user does not exist", err);
    }

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Insert new user
    // Generate a simple unique app_id
    const app_id = `${role}_${Date.now()}`;
    
    const insertPayload = {
      body: [{
        app_id,
        name,
        role,
        email,
        password,
        xp: 0,
        streak: 0
      }],
      path_variables: {
        id: "58391000000016001" // Users table ID
      }
    };

    const insertResult = await callCatalystTool('CatalystbyZoho_Insert_Rows', insertPayload);
    
    if (insertResult && insertResult.length > 0) {
      const createdUser = insertResult[0];
      return NextResponse.json({ 
        message: 'User created successfully',
        user: {
          id: createdUser.app_id,
          name: createdUser.name,
          role: createdUser.role,
          email: createdUser.email,
          xp: createdUser.xp,
          streak: createdUser.streak
        }
      }, { status: 201 });
    } else {
      throw new Error("Failed to insert user");
    }

  } catch (error) {
    console.error('Signup error:', error);
    if (error.message && error.message.includes("Duplicate value")) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 200 }); // Changed from 409 to bypass HTML
    }
    return NextResponse.json({ error: error.message || 'Internal server error', stack: error.stack }, { status: 200 }); // Changed from 500 to bypass HTML
  }
}
