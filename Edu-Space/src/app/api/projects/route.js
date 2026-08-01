import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function GET(request) {
  try {
    // In a fully featured app, we'd filter by teacherId, but since Projects 
    // are currently global or not tied to a specific class in the schema directly,
    // we'll fetch all projects. For demo purposes, this works.
    
    const response = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: { query: "SELECT * FROM Projects" }
    });
    
    // Also fetch students to get their names
    const studentsRes = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: { query: "SELECT ROWID, name FROM Users WHERE role = 'student'" }
    });
    
    const studentMap = {};
    studentsRes.forEach(row => {
      studentMap[row.Users.ROWID] = row.Users.name;
    });

    const projects = response.map(row => ({
      id: row.Projects.ROWID,
      app_id: row.Projects.app_id,
      title: row.Projects.title,
      description: row.Projects.description,
      link: row.Projects.link,
      studentId: row.Projects.student_id,
      studentName: studentMap[row.Projects.student_id] || 'Unknown Student',
      status: row.Projects.status,
      submittedAt: parseInt(row.Projects.submitted_at) || Date.now()
    }));

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Fetch projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, link, studentId } = body;

    const response = await callCatalystTool('CatalystbyZoho_Insert_Rows', {
      body: [
        { 
          app_id: `proj-${Date.now()}`,
          title, 
          description, 
          link,
          student_id: studentId,
          status: 'pending',
          submitted_at: Date.now().toString()
        }
      ],
      path_variables: {
        id: "58391000000020001" // Projects table ID
      }
    });

    return NextResponse.json({ success: true, id: response[0].ROWID });
  } catch (error) {
    console.error('Submit project error:', error);
    return NextResponse.json({ error: 'Failed to submit project' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });

    await callCatalystTool('CatalystbyZoho_Delete_Row_By_Id', {
      path_variables: {
        resourceId: "58391000000020001", // Projects table ID
        id: id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
