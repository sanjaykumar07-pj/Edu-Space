import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function GET() {
  try {
    const response = await callCatalystTool('CatalystbyZoho_Execute_Query', {
      body: {
        query: "SELECT * FROM Events"
      }
    });

    const events = response.map(row => {
      let attendees = [];
      try {
        attendees = JSON.parse(row.Events.attendees || '[]');
      } catch (e) {}

      return {
        id: row.Events.ROWID,
        title: row.Events.title,
        description: row.Events.description,
        date: parseInt(row.Events.event_date) || 0,
        createdBy: row.Events.created_by,
        attendees
      };
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Fetch events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, date, createdBy } = body;

    const response = await callCatalystTool('CatalystbyZoho_Insert_Rows', {
      body: [
        { 
          app_id: `evt-${Date.now()}`,
          title, 
          description, 
          event_date: date ? date.toString() : Date.now().toString(),
          created_by: createdBy || "admin",
          attendees: "[]"
        }
      ],
      path_variables: {
        id: "58391000000022001" // Events table ID
      }
    });

    return NextResponse.json({ success: true, id: response[0].ROWID });
  } catch (error) {
    console.error('Add event error:', error);
    return NextResponse.json({ error: 'Failed to add event' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { eventId, studentId, attendees } = body; // passing attendees from frontend to avoid extra GET
    
    // Add studentId if not present
    let newAttendees = JSON.parse(attendees || '[]');
    if (!newAttendees.includes(studentId)) {
      newAttendees.push(studentId);
    }

    await callCatalystTool('CatalystbyZoho_Update_Rows', {
      body: [
        {
          ROWID: eventId,
          attendees: JSON.stringify(newAttendees)
        }
      ],
      path_variables: {
        id: "58391000000022001" // Events table ID
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('RSVP error:', error);
    return NextResponse.json({ error: 'Failed to RSVP' }, { status: 500 });
  }
}
