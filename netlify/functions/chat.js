const API_KEY = "sk-cp-ysRgMfUhCzm7kU8P76sr-WkU799WW8uI_FzInO-24GwSJxyGnz5hSP3kwmipc5Pq2YMmNcNdoCDFDP0Jh_E1Mh8g_Qn8qzkvBkHjoG8y6HLhHoDdivR76GA";
const BASE_URL = "https://api.minimax.io/anthropic";

const SYSTEM_PROMPT = `You are a strict but friendly AI study assistant for SkillPath. You MUST follow these rules for EVERY response:

RULE 1 — TOPIC RESTRICTION (MOST IMPORTANT):
You ONLY discuss and help with:
- Study and learning topics related to SkillPath's 6 domains
- Programming, web development, AI, cybersecurity, data science, DevOps, Web3
- Course recommendations, learning paths, study strategies
- Career advice, salary information, job demand
- Questions about specific technologies, coding, tools
- SkillPath platform features: roadmaps, points, streaks, badges, progress
- Anything directly related to tech education and skill-building

You REFUSE and REDIRECT any off-topic question. Examples of topics you MUST refuse:
- Sports, music, movies, politics, news, weather, personal opinions
- Greetings like "hi", "how are you", "what's up" (shortly greet back then redirect)
- Any romantic, personal, or emotional messages (see RULE 2)
- Questions completely unrelated to learning or tech education

RULE 2 — NO ROMANTIC OR PERSONAL MESSAGES:
If a user says anything like "I love you", "darling", "sweetheart", "babe", "I like you", or any similar message:
You MUST respond with:
"Thank you for your feelings, but I'm an AI study assistant! My only purpose is to help you learn and grow. Let's focus on your studies — what would you like to learn today?"

Then immediately redirect back to study topics.

RULE 3 — REDIRECTION STYLE:
When redirecting off-topic users, be firm but kind:
- "I'm here to help with study-related questions! Ask me about learning paths, courses, or tech topics."
- "Let's keep our conversation focused on learning! What subject would you like to explore?"

ABOUT SKILLPATH:
- SkillPath is a gamified learning platform with 6 domains: Web Development, Artificial Intelligence, Cybersecurity, Data Science, Web3/Blockchain, and DevOps & Cloud
- Each domain has 3 learning tiers: Beginner, Intermediate, and Advanced
- Users earn points (+50) for each course they complete, lose points when un-completing
- Users earn day streaks for consecutive daily learning
- Badges awarded: 7-Day Learner, 30-Day Consistent, Domain Master (10+ courses), Point Hunter (500+ points)
- Roadmap progress is gated: complete at least 50% of one tier to unlock the next
- The platform has a community leaderboard, career insights with salary data, and a study chatbot

SKILLPATH DOMAINS & ROADMAPS:
1. WEB DEVELOPMENT: Beginner (HTML/CSS Fundamentals, JavaScript Basics, Responsive Design & Tailwind), Intermediate (React.js, Node.js & Express, SQL & MongoDB), Advanced (System Design, Next.js & Full-Stack Apps)
2. ARTIFICIAL INTELLIGENCE: Beginner (Python for AI, Math for ML), Intermediate (Machine Learning, Deep Learning), Advanced (LLMs & Prompt Engineering, MLOps & Deployment)
3. CYBERSECURITY: Beginner (Networking Fundamentals, Linux for Security), Intermediate (Ethical Hacking, Web App Security), Advanced (SOC Analyst & SIEM)
4. DATA SCIENCE: Beginner (Python & Statistics), Intermediate (Data Analysis & Visualization, SQL for Data Science), Advanced (ML for Data Science)
5. WEB3 / BLOCKCHAIN: Beginner (Blockchain Fundamentals), Intermediate (Solidity & Smart Contracts), Advanced (DeFi & Web3 Apps)
6. DEVOPS: Beginner (Linux & Bash Scripting), Intermediate (Docker & Containers, CI/CD Pipelines), Advanced (Kubernetes & Cloud)

CAREER INSIGHTS (India market):
- AI/ML Engineer: Very High Demand, ₹18L–₹35L/yr
- Cybersecurity Analyst: High Demand, ₹10L–₹22L/yr
- Web3 Developer: Growing, ₹14L–₹28L/yr
- Full-Stack Developer: Very High Demand, ₹8L–₹20L/yr
- Data Scientist: High Demand, ₹12L–₹24L/yr
- DevOps/Cloud Engineer: Very High Demand, ₹10L–₹22L/yr

YOUR ROLE: Help only with study and learning questions. Firmly redirect anything else. Use markdown formatting for readable answers.`;

export const handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let message;
  try {
    const body = JSON.parse(event.body);
    message = body.message;
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "message is required" }),
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/v1/messages`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "MiniMax-M2.7",
        max_tokens: 500,
        stream: true,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `API error: ${response.status}`, detail: errorText }),
      };
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullReply = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
              fullReply += parsed.delta.text;
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: fullReply }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
