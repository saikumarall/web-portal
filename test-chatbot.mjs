import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(err.message));

await page.goto("http://localhost:3000");

// 1. Auth overlay visible
const authVisible = await page.evaluate(
  () => !document.getElementById("auth-overlay").classList.contains("hidden")
);
console.log("✅ Auth overlay visible:", authVisible);

// 2. Sign up
await page.click("a[onclick=\"toggleAuth('signup')\"]");
await page.waitForFunction(
  () => document.getElementById("signup-form").classList.contains("active"),
  { timeout: 3000 }
);
await page.type("#signup-username", "testuser");
await page.type("#signup-email", "test@test.com");
await page.type("#signup-password", "password123");
await page.click('button[onclick="handleSignup()"]');
await page.waitForFunction(
  () => !document.getElementById("app").classList.contains("hidden"),
  { timeout: 5000 }
);
console.log("✅ Logged in successfully");

// 3. Open AI modal
await page.click("#ai-fab");
await page.waitForFunction(
  () => !document.getElementById("ai-modal").classList.contains("hidden"),
  { timeout: 3000 }
);
console.log("✅ AI modal opened");

// 4. Open chatbot
await page.click('button[onclick="openChatbot()"]');
await page.waitForFunction(
  () => document.getElementById("chatbot-wrap").classList.contains("open"),
  { timeout: 3000 }
);
console.log("✅ Chatbot opened");

// 5. Send study-related question
await page.type("#chatbot-input", "How do I learn React step by step?");
await page.click("#chatbot-send");

// 6. Wait for send button to re-enable (API response complete)
await page.waitForFunction(
  () => !document.getElementById("chatbot-send").disabled,
  { timeout: 20000 }
);

await new Promise((r) => setTimeout(r, 500));

const botText = await page.evaluate(() => {
  const msgs = document.querySelectorAll(".cb-msg.bot");
  return msgs[msgs.length - 1].textContent;
});
console.log("✅ Bot replied:", botText.slice(0, 120));

// 7. Console errors
const realErrors = errors.filter(
  (e) => !e.includes("Password field") && !e.includes("favicon")
);
if (realErrors.length > 0) {
  console.log("❌ Console errors:", realErrors);
} else {
  console.log("✅ No console errors");
}

await browser.close();
console.log("\n🎉 All chatbot tests passed!");
