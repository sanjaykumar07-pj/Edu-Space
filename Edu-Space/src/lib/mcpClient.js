import catalyst from 'zcatalyst-sdk-node';

let app = null;

export async function callCatalystTool(toolName, args) {
  if (!app) {
    try {
      app = catalyst.initialize();
    } catch (e) {
      console.warn("Catalyst initialization warning:", e.message);
      // Fallback if testing locally without env vars, though it will likely fail.
      app = catalyst.initialize({ project_id: '58391000000013051' }); 
    }
  }

  const zcql = app.zcql();
  const datastore = app.datastore();

  try {
    if (toolName === 'CatalystbyZoho_Execute_Query') {
      const query = args.body.query;
      const result = await zcql.executeZCQLQuery(query);
      
      // The native Catalyst SDK returns rows nested under the table name (e.g. { Users: { name: "x" } })
      // The MCP tool flattened this automatically. We must flatten it here to keep the app working!
      const flattened = result.map(row => {
        const keys = Object.keys(row);
        let merged = {};
        for (const k of keys) {
          merged = { ...merged, ...row[k] };
        }
        return merged;
      });
      return flattened;
    } 
    else if (toolName === 'CatalystbyZoho_Insert_Rows') {
      const tableId = args.path_variables.id;
      const table = datastore.table(tableId);
      let rows = args.body;
      
      // Native SDK expects an array.
      if (!Array.isArray(rows)) rows = [rows];
      
      const result = await table.insertRows(rows);
      // Native SDK returns an array of inserted rows
      return result;
    }
    else if (toolName === 'CatalystbyZoho_Update_Rows') {
      const tableId = args.path_variables.id;
      const table = datastore.table(tableId);
      let rows = args.body;
      
      if (!Array.isArray(rows)) rows = [rows];
      
      const result = await table.updateRows(rows);
      return result;
    }
    else if (toolName === 'CatalystbyZoho_Delete_Row_By_Id') {
      const tableId = args.path_variables.id;
      const rowId = args.path_variables.ROWID;
      const table = datastore.table(tableId);
      
      const result = await table.deleteRow(rowId);
      return result;
    }
    else {
      throw new Error(`Tool ${toolName} is not mapped in the native wrapper.`);
    }
  } catch (error) {
    console.error(`Catalyst Native Error (${toolName}):`, error);
    if (error.message && error.message.includes("Duplicate value")) {
      throw new Error("Duplicate value");
    }
    throw error;
  }
}
