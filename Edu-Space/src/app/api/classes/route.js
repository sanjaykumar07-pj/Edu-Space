import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function GET() {
  try {
    const response = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: {
        query: "SELECT * FROM Classes"
      }
    });
    
    // Parse student_ids back into array
    const classes = response.map(row => {
      let parsedStudentIds = [];
      try {
        parsedStudentIds = JSON.parse(row.Classes.student_ids || '[]');
      } catch (e) {}

      return {
        id: row.Classes.ROWID,
        app_id: row.Classes.app_id,
        name: row.Classes.name,
        code: row.Classes.code,
        teacherId: row.Classes.teacher_id,
        avgScore: row.Classes.avg_score || 0,
        studentIds: parsedStudentIds
      };
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Fetch classes error:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, code, teacherId } = body;
    
    const app_id = `class-${Date.now()}`;

    const response = await callCatalystTool('CatalystbyZoho_Insert_Rows', {
      body: [
        { 
          app_id,
          name, 
          code, 
          teacher_id: teacherId,
          student_ids: "[]",
          avg_score: 0
        }
      ],
      path_variables: {
        id: "58391000000017011" // Classes table ID
      }
    });

    return NextResponse.json({ success: true, id: response[0].ROWID });
  } catch (error) {
    console.error('Add class error:', error);
    return NextResponse.json({ error: 'Failed to add class' }, { status: 500 });
  }
}
