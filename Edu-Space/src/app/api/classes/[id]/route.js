import { NextResponse } from 'next/server';
import { callCatalystTool } from '@/lib/mcpClient';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await callCatalystTool('CatalystbyZoho_Delete_Row_By_Id', {
      path_variables: {
        tableId: "58391000000017011", // Classes table ID
        rowId: id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete class error:', error);
    return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 });
  }
}
