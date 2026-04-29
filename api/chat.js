import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  baseURL: "https://api.minimax.io/anthropic",
  apiKey: "sk-cp-ysRgMfUhCzm7kU8P76sr-WkU799WW8uI_FzInO-24GwSJxyGnz5hSP3kwmipc5Pq2YMmNcNdoCDFDP0Jh_E1Mh8g_Qn8qzkvBkHjoG8y6HLhHoDdivR76GA",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const msg = await client.messages.create({
      model: "MiniMax-M2.7",
      max_tokens: 1000,
      messages: [{ role: "user", content: message }],
      stream: false,
    });

    let text = "";
    for (const block of msg.content) {
      if (block.type === "text") text += block.text;
    }

    res.write(`data: ${JSON.stringify({ reply: text })}\n\n`);

    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
