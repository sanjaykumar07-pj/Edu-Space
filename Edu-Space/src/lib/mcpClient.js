import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Ensure this only runs on the server
if (typeof window !== 'undefined') {
  throw new Error('mcpClient can only be used on the server side');
}

let mcpClientInstance = null;
let mcpTransport = null;

export async function getMcpClient() {
  if (mcpClientInstance) {
    return mcpClientInstance;
  }

  mcpTransport = new StdioClientTransport({
    command: "npx",
    args: [
      "-y",
      "mcp-remote",
      "https://edu-space-60081095824.zohomcp.in/mcp/1edf6b911baa423f8bb187994af04fe2/message",
      "--transport",
      "http-only"
    ],
  });

  mcpClientInstance = new Client({
    name: "edu-space-nextjs-backend",
    version: "1.0.0",
  }, {
    capabilities: {}
  });

  await mcpClientInstance.connect(mcpTransport);
  return mcpClientInstance;
}

export async function callCatalystTool(toolName, args) {
  const client = await getMcpClient();
  const result = await client.callTool({
    name: toolName,
    arguments: {
      ...args,
      headers: { "Catalyst-org": 60081086750, Environment: "Development" },
      path_variables: { projectId: "58391000000013051", ...args.path_variables }
    }
  });

  if (result.isError) {
    throw new Error(`MCP Tool Error: ${JSON.stringify(result)}`);
  }

  // Parse the structured content if available
  let parsedData = null;
  if (result.structuredContent && result.structuredContent.data) {
    parsedData = result.structuredContent.data;
  } else if (result.content && result.content.length > 0 && result.content[0].text) {
    try {
      parsedData = JSON.parse(result.content[0].text);
    } catch(e) {}
  }

  if (parsedData) {
    if (parsedData.status === "failure") {
      const errMsg = parsedData.data ? parsedData.data.message : JSON.stringify(parsedData);
      throw new Error(errMsg);
    }
    return parsedData.data || parsedData;
  }

  return result;
}
