import { callCatalystTool } from './src/lib/mcpClient.js';

async function createColumn(tableId, columnDef) {
  try {
    console.log(`Creating column ${columnDef.column_name} on table ${tableId}...`);
    await callCatalystTool('CatalystbyZoho_Create_Column', {
      path_variables: { id: tableId },
      body: [columnDef]
    });
    console.log(`Success: ${columnDef.column_name}`);
  } catch (err) {
    console.error(`Failed to create ${columnDef.column_name}: ${err.message}`);
  }
}

async function main() {
  const usersTableId = "58391000000016001";
  const meetingsTableId = "58391000000020365";
  const attendanceTableId = "58391000000029001";
  const quizAttemptsTableId = "58391000000024003";

  const varcharDef = (name, max = 250) => ({
    column_name: name,
    data_type: "varchar",
    is_unique: "false",
    is_mandatory: "false",
    search_index_enabled: "false",
    audit_consent: "false",
    max_length: max
  });

  const bigintDef = (name) => ({
    column_name: name,
    data_type: "bigint",
    is_unique: "false",
    is_mandatory: "false",
    search_index_enabled: "false",
    audit_consent: "false"
  });

  const intDef = (name) => ({
    column_name: name,
    data_type: "int",
    is_unique: "false",
    is_mandatory: "false",
    search_index_enabled: "false",
    audit_consent: "false"
  });

  console.log("Starting column creation...");

  // Attendance
  await createColumn(attendanceTableId, varcharDef('attendanceDate'));

  // QuizAttempts
  await createColumn(quizAttemptsTableId, bigintDef('attemptTimestamp'));

  console.log("Done!");
  process.exit(0);
}

main();
