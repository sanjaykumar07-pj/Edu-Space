import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    await callCatalystTool('CatalystbyZoho_Update_Rows', {
      body: {
        rows: [
          { ROWID: id, status }
        ]
      },
      path_variables: {
        table_id: "58391000000020001" // Projects table ID
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update project status error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
