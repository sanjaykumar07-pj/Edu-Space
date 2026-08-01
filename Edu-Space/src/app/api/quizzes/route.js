import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');

    let query = "SELECT * FROM Quizzes";
    if (teacherId) {
      query += ` WHERE created_by = '${teacherId}'`;
    }

    const response = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: { query }
    });

    const quizzes = response.map(row => {
      let parsedQuestions = [];
      try {
        parsedQuestions = JSON.parse(row.Quizzes.questions || '[]');
      } catch (e) {}

      return {
        id: row.Quizzes.ROWID,
        app_id: row.Quizzes.app_id,
        title: row.Quizzes.title,
        classId: row.Quizzes.class_id,
        createdBy: row.Quizzes.created_by,
        questions: parsedQuestions
      };
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Fetch quizzes error:', error);
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, classId, createdBy, questions } = body;
    
    const app_id = `quiz-${Date.now()}`;

    const response = await callCatalystTool('CatalystbyZoho_Insert_Rows', {
      body: [
        { 
          app_id,
          title, 
          class_id: classId, 
          created_by: createdBy,
          questions: JSON.stringify(questions || [])
        }
      ],
      path_variables: {
        id: "58391000000017370" // Quizzes table ID
      }
    });

    return NextResponse.json({ success: true, id: response[0].ROWID });
  } catch (error) {
    console.error('Create quiz error:', error);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 });

    await callCatalystTool('CatalystbyZoho_Delete_Row_By_Id', {
      path_variables: {
        resourceId: "58391000000017370", // Quizzes table ID
        id: id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete quiz error:', error);
    return NextResponse.json({ error: 'Failed to delete quiz' }, { status: 500 });
  }
}
