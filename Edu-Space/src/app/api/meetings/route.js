import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function GET() {
  try {
    const response = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: {
        query: "SELECT * FROM Meetings"
      }
    });

    const classesResponse = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: { query: "SELECT ROWID, name, code, student_ids FROM Classes" }
    });

    const classesMap = {};
    classesResponse.forEach(row => {
      let studentIds = [];
      try {
        studentIds = JSON.parse(row.Classes.student_ids || '[]');
      } catch (e) {}

      classesMap[row.Classes.ROWID] = {
        name: row.Classes.name,
        code: row.Classes.code,
        totalStudents: studentIds.length
      };
    });

    const meetings = response.map(row => {
      const classInfo = classesMap[row.Meetings.classId] || { name: 'Unknown', code: 'Unknown', totalStudents: 0 };
      
      return {
        id: row.Meetings.ROWID,
        class: classInfo.name,
        code: classInfo.code,
        classId: row.Meetings.classId,
        teacherId: row.Meetings.startedBy,
        roomId: row.Meetings.roomId,
        status: 'Live', // Consider all records in this table as live
        attendees: 0,
        total: classInfo.totalStudents,
        duration: 'Live Now'
      };
    });

    return NextResponse.json(meetings);
  } catch (error) {
    console.error('Fetch meetings error:', error);
    return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { classId, teacherId } = body;

    const roomId = `meet-${classId}-${Date.now()}`;

    const response = await callCatalystTool('CatalystbyZoho_Insert_Rows', {
      body: [
        { 
          classId, 
          startedBy: teacherId, 
          roomId,
          startTime: Date.now(),
          participants: "[]"
        }
      ],
      path_variables: {
        id: "58391000000020365" // Meetings table ID
      }
    });

    return NextResponse.json({ success: true, id: response[0].ROWID, roomId });
  } catch (error) {
    console.error('Create meeting error:', error);
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Meeting ID is required' }, { status: 400 });

    await callCatalystTool('CatalystbyZoho_Delete_Row_By_Id', {
      path_variables: {
        resourceId: "58391000000020365", // Meetings table ID
        id: id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete meeting error:', error);
    return NextResponse.json({ error: 'Failed to delete meeting' }, { status: 500 });
  }
}
