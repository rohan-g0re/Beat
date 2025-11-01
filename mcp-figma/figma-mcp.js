#!/usr/bin/env node
import dotenv from "dotenv";
import fetch from "node-fetch";
import readline from "readline";

dotenv.config();
const token = process.env.FIGMA_TOKEN;

async function getFile(fileId) {
  const res = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
    headers: { "X-Figma-Token": token }
  });
  return res.json();
}

async function getNode(fileId, nodeId) {
  const res = await fetch(
    `https://api.figma.com/v1/files/${fileId}/nodes?ids=${nodeId}`,
    { headers: { "X-Figma-Token": token } }
  );
  return res.json();
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(JSON.stringify({
  mcpVersion: "0.1",
  serverName: "figma-mcp",
  functions: {
    getFile: {
      params: { fileId: "string" }
    },
    getNode: {
      params: { fileId: "string", nodeId: "string" }
    }
  }
}));

rl.on("line", async (input) => {
  const request = JSON.parse(input);
  const { id, method, params } = request;

  let result;

  if (method === "getFile") {
    result = await getFile(params.fileId);
  } else if (method === "getNode") {
    result = await getNode(params.fileId, params.nodeId);
  } else {
    result = { error: "Unknown method" };
  }

  console.log(JSON.stringify({ id, result }));
});

