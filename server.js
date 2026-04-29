import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import url from "url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const client = new Anthropic({
  baseURL: "https://api.minimax.io/anthropic",
  apiKey: "sk-cp-ysRgMfUhCzm7kU8P76sr-WkU799WW8uI_FzInO-24GwSJxyGnz5hSP3kwmipc5Pq2YMmNcNdoCDFDP0Jh_E1Mh8g_Qn8qzkvBkHjoG8y6HLhHoDdivR76GA",
});

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
};

async function handleApiChat(req, res) {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = chunks.join("");

  try {
    const { message } = JSON.parse(body);
    if (!message) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "message is required" }));
      return;
    }

    const stream = await client.messages.stream({
      model: "MiniMax-M2.7",
      max_tokens: 500,
      messages: [{ role: "user", content: message }],
    });

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });

    for await (const event of stream) {
      if (event.type === "message_delta") {
        break;
      }
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        res.write(`data: ${JSON.stringify({ reply: event.delta.text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url);

  if (parsed.pathname === "/api/chat") {
    return handleApiChat(req, res);
  }

  let filePath = parsed.pathname === "/" ? "/index.html" : parsed.pathname;
  filePath = path.join(__dirname, filePath);

  const ext = path.extname(filePath);
  const mime = MIME[ext] || "text/plain";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mime });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`SkillPath running at http://localhost:${PORT}`);
});
