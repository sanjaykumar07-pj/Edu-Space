import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');

    if (!teacherId) {
      return NextResponse.json({ error: 'Missing teacherId parameter' }, { status: 400 });
    }

    // Catalyst doesn't strictly type ZCQL well for string filtering sometimes if it's bigint, 
    // but assuming teacher_id is a string/varchar based on column setup
    const response = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: {
        query: `SELECT * FROM Classes WHERE teacher_id = '${teacherId}'`
      }
    });

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
    console.error('Fetch teacher classes error:', error);
    return NextResponse.json({ error: 'Failed to fetch teacher classes' }, { status: 500 });
  }
}
