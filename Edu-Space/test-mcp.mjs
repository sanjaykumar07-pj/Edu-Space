import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  console.log("Starting MCP client...");
  const transport = new StdioClientTransport({
    command: "npx",
    args: [
      "mcp-remote",
      "https://edu-space-60081095824.zohomcp.in/mcp/1edf6b911baa423f8bb187994af04fe2/message",
      "--transport",
      "http-only"
    ],
  });

  const client = new Client({
    name: "test-client",
    version: "1.0.0",
  }, {
    capabilities: {}
  });

  await client.connect(transport);
  console.log("Connected!");

  try {
    const result = await client.callTool({
      name: "CatalystbyZoho_Get_Rows",
      arguments: {
        path_variables: { projectId: "58391000000013051", id: "58391000000016001" },
        headers: { "Catalyst-org": 60081086750, Environment: "Development" }
      }
    });
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await transport.close();
  }
}

main().catch(console.error);
