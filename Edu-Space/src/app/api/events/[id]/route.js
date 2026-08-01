import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await callCatalystTool('CatalystbyZoho_Delete_Row_By_Id', {
      path_variables: {
        tableId: "58391000000022001", // Events table ID
        rowId: id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
