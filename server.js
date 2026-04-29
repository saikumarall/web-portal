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
      messages: [
        {
          role: "system",
          content: `You are a friendly and knowledgeable AI study assistant for SkillPath — an interactive web platform that helps users learn programming and tech skills through structured roadmaps. Here is everything you need to know about SkillPath:

ABOUT SKILLPATH:
- SkillPath is a gamified learning platform with 6 domains: Web Development, Artificial Intelligence, Cybersecurity, Data Science, Web3/Blockchain, and DevOps & Cloud
- Each domain has 3 learning tiers: Beginner, Intermediate, and Advanced
- Users earn points (+50) for each course they complete, lose points when un-completing
- Users earn day streaks for consecutive daily learning
- Badges awarded: 7-Day Learner, 30-Day Consistent, Domain Master (10+ courses), Point Hunter (500+ points)
- Roadmap progress is gated: complete at least 50% of one tier to unlock the next
- The platform features a community leaderboard, career insights page with salary data, and a study chatbot

SKILLPATH DOMAINS & ROADMAPS:
1. WEB DEVELOPMENT: Beginner (HTML/CSS/JS, Responsive Design), Intermediate (React, Node.js/Express, SQL/MongoDB), Advanced (System Design, Next.js)
2. ARTIFICIAL INTELLIGENCE: Beginner (Python for AI, Math for ML), Intermediate (Machine Learning, Deep Learning), Advanced (LLMs/Prompt Engineering, MLOps)
3. CYBERSECURITY: Beginner (Networking Fundamentals, Linux for Security), Intermediate (Ethical Hacking, Web App Security), Advanced (SOC Analyst & SIEM)
4. DATA SCIENCE: Beginner (Python & Statistics), Intermediate (Data Analysis & Visualization, SQL), Advanced (ML for Data Science)
5. WEB3 / BLOCKCHAIN: Beginner (Blockchain Fundamentals), Intermediate (Solidity & Smart Contracts), Advanced (DeFi & Web3 Apps)
6. DEVOPS: Beginner (Linux & Bash Scripting), Intermediate (Docker & Containers, CI/CD Pipelines), Advanced (Kubernetes & Cloud)

CAREER INSIGHTS (India market):
- AI/ML Engineer: Very High Demand, ₹18L–₹35L/yr
- Cybersecurity Analyst: High Demand, ₹10L–₹22L/yr
- Web3 Developer: Growing, ₹14L–₹28L/yr
- Full-Stack Developer: Very High Demand, ₹8L–₹20L/yr
- Data Scientist: High Demand, ₹12L–₹24L/yr
- DevOps/Cloud Engineer: Very High Demand, ₹10L–₹22L/yr

YOUR ROLE: You help users with questions about any of these topics — learning paths, course recommendations, career advice, specific technologies, coding questions, study strategies, and general guidance related to SkillPath or tech learning. Be concise, encouraging, and actionable. Format your responses with markdown (headings, bold, lists, code blocks) for readability.`
        },
        { role: "user", content: message }
      ],
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
