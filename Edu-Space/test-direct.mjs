import fs from 'fs';

async function testMcp() {
  const mcpUrl = "https://edu-space-60081095824.zohomcp.in/mcp/1edf6b911baa423f8bb187994af04fe2/message";
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "CatalystbyZoho_Execute_Query",
      arguments: {
        body: { query: "SELECT * FROM Users LIMIT 1" },
        headers: { "Catalyst-org": 60081086750, Environment: "Development" },
        path_variables: { projectId: "58391000000013051" }
      }
    }
  };

  try {
    const response = await fetch(mcpUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", text);
  } catch(e) {
    console.error(e);
  }
}
testMcp();
