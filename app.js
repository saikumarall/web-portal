/* ══════════════════════════════════════════
   SKILLPATH — app.js
   Full SPA logic, localStorage, gamification
══════════════════════════════════════════ */

"use strict";

// ─── DATA ───────────────────────────────────────────────────────
const DOMAINS = [
  {
    id: "webdev", name: "Web Development",
    desc: "Build full-stack web apps from HTML to React & Node.js.",
    tags: ["Trending", "Beginner Friendly"],
    accent: "#ff008a",
    cardGrad: "linear-gradient(135deg, #ffe0f4 0%, #f0e0ff 100%)"
  },
  {
    id: "ai", name: "Artificial Intelligence",
    desc: "Machine learning, deep learning, NLP, and AI engineering.",
    tags: ["Trending", "High Demand"],
    accent: "#00b8d4",
    cardGrad: "linear-gradient(135deg, #d0faff 0%, #e0eeff 100%)"
  },
  {
    id: "cybersec", name: "Cybersecurity",
    desc: "Ethical hacking, network defense, SOC analyst path.",
    tags: ["Growing Fast"],
    accent: "#00b87a",
    cardGrad: "linear-gradient(135deg, #d0fff0 0%, #d0faff 100%)"
  },
  {
    id: "datascience", name: "Data Science",
    desc: "Statistics, Python, pandas, visualization & ML pipelines.",
    tags: ["Trending", "High Pay"],
    accent: "#e6a800",
    cardGrad: "linear-gradient(135deg, #fff8d0 0%, #ffe8d0 100%)"
  },
  {
    id: "web3", name: "Web3 / Blockchain",
    desc: "Smart contracts, DeFi, Solidity, and decentralized apps.",
    tags: ["Emerging"],
    accent: "#6c00ff",
    cardGrad: "linear-gradient(135deg, #ede0ff 0%, #ffe0f4 100%)"
  },
  {
    id: "devops", name: "DevOps & Cloud",
    desc: "CI/CD, Docker, Kubernetes, AWS, and infrastructure as code.",
    tags: ["High Demand"],
    accent: "#ff5c00",
    cardGrad: "linear-gradient(135deg, #ffe8d8 0%, #fff8d0 100%)"
  }
];

const ROADMAPS = {
  webdev: {
    beginner: [
      { id:"wd-b1", title:"HTML & CSS Fundamentals", desc:"Structure & style your first web pages. Learn semantic HTML, CSS box model, flexbox, and grid.", duration:"4 weeks", yt:"https://youtube.com/results?search_query=html+css+full+course", free:"https://www.freecodecamp.org/learn/2022/responsive-web-design/", paid:"https://www.udemy.com/course/the-web-developer-bootcamp/" },
      { id:"wd-b2", title:"JavaScript Basics", desc:"Variables, loops, functions, DOM manipulation, and event handling in vanilla JS.", duration:"5 weeks", yt:"https://youtube.com/results?search_query=javascript+for+beginners", free:"https://javascript.info/", paid:"https://www.udemy.com/course/the-complete-javascript-course/" },
      { id:"wd-b3", title:"Responsive Design & Tailwind", desc:"Build layouts that work on any screen using media queries and Tailwind CSS.", duration:"2 weeks", yt:"https://youtube.com/results?search_query=tailwind+css+crash+course", free:"https://tailwindcss.com/docs", paid:"https://scrimba.com/learn/tailwind" },
    ],
    intermediate: [
      { id:"wd-i1", title:"React.js", desc:"Component-based UIs, hooks, state management, and React Router.", duration:"6 weeks", yt:"https://youtube.com/results?search_query=react+full+course", free:"https://react.dev/learn", paid:"https://www.udemy.com/course/react-the-complete-guide-incl-redux/" },
      { id:"wd-i2", title:"Node.js & Express", desc:"Build REST APIs, middleware, authentication, and connect to databases.", duration:"5 weeks", yt:"https://youtube.com/results?search_query=node+express+full+course", free:"https://nodeschool.io/", paid:"https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/" },
      { id:"wd-i3", title:"SQL & MongoDB", desc:"Design relational schemas, write queries, and work with NoSQL documents.", duration:"3 weeks", yt:"https://youtube.com/results?search_query=sql+for+beginners+full+course", free:"https://www.sqlbolt.com/", paid:"https://www.udemy.com/course/the-complete-developers-guide-to-mongodb/" },
    ],
    advanced: [
      { id:"wd-a1", title:"System Design", desc:"Scalable architecture, caching, load balancing, microservices, and CDNs.", duration:"6 weeks", yt:"https://youtube.com/results?search_query=system+design+interview", free:"https://github.com/donnemartin/system-design-primer", paid:"https://www.educative.io/courses/grokking-the-system-design-interview" },
      { id:"wd-a2", title:"Next.js & Full-Stack Apps", desc:"SSR, SSG, API routes, auth, and deployment on Vercel.", duration:"5 weeks", yt:"https://youtube.com/results?search_query=nextjs+full+course", free:"https://nextjs.org/learn", paid:"https://www.udemy.com/course/nextjs-react-the-complete-guide/" },
    ]
  },
  ai: {
    beginner: [
      { id:"ai-b1", title:"Python for AI", desc:"NumPy, Pandas, Matplotlib — the scientific Python stack for ML.", duration:"4 weeks", yt:"https://youtube.com/results?search_query=python+for+data+science+full+course", free:"https://www.kaggle.com/learn/python", paid:"https://www.udemy.com/course/complete-python-bootcamp/" },
      { id:"ai-b2", title:"Math for ML", desc:"Linear algebra, calculus, probability, and statistics fundamentals.", duration:"6 weeks", yt:"https://youtube.com/results?search_query=math+for+machine+learning", free:"https://www.khanacademy.org/math/linear-algebra", paid:"https://www.coursera.org/specializations/mathematics-machine-learning" },
    ],
    intermediate: [
      { id:"ai-i1", title:"Machine Learning", desc:"Supervised, unsupervised learning, scikit-learn, model evaluation.", duration:"8 weeks", yt:"https://youtube.com/results?search_query=machine+learning+course+andrew+ng", free:"https://www.coursera.org/learn/machine-learning", paid:"https://www.udemy.com/course/machinelearning/" },
      { id:"ai-i2", title:"Deep Learning", desc:"Neural networks, CNNs, RNNs with TensorFlow and PyTorch.", duration:"8 weeks", yt:"https://youtube.com/results?search_query=deep+learning+full+course", free:"https://www.fast.ai/", paid:"https://www.coursera.org/specializations/deep-learning" },
    ],
    advanced: [
      { id:"ai-a1", title:"LLMs & Prompt Engineering", desc:"Fine-tuning, RAG, agents, LangChain, and deploying LLM applications.", duration:"6 weeks", yt:"https://youtube.com/results?search_query=langchain+llm+full+course", free:"https://www.deeplearning.ai/short-courses/", paid:"https://www.udemy.com/course/langchain/" },
      { id:"ai-a2", title:"MLOps & Deployment", desc:"ML pipelines, model serving, monitoring, Docker, and MLflow.", duration:"5 weeks", yt:"https://youtube.com/results?search_query=mlops+full+course", free:"https://madewithml.com/", paid:"https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops" },
    ]
  },
  cybersec: {
    beginner: [
      { id:"cs-b1", title:"Networking Fundamentals", desc:"OSI model, TCP/IP, DNS, firewalls, and basic network security.", duration:"4 weeks", yt:"https://youtube.com/results?search_query=networking+fundamentals+full+course", free:"https://www.coursera.org/learn/computer-networking", paid:"https://www.udemy.com/course/complete-networking-fundamentals-course-ccna-start/" },
      { id:"cs-b2", title:"Linux for Security", desc:"Command line, permissions, scripting, and security hardening.", duration:"3 weeks", yt:"https://youtube.com/results?search_query=linux+for+beginners+full+course", free:"https://linuxjourney.com/", paid:"https://www.udemy.com/course/linux-administration-bootcamp/" },
    ],
    intermediate: [
      { id:"cs-i1", title:"Ethical Hacking", desc:"Reconnaissance, scanning, exploitation, and post-exploitation with Kali Linux.", duration:"8 weeks", yt:"https://youtube.com/results?search_query=ethical+hacking+full+course", free:"https://www.hacksplaining.com/", paid:"https://www.udemy.com/course/learn-ethical-hacking-from-scratch/" },
      { id:"cs-i2", title:"Web App Security", desc:"OWASP Top 10, XSS, SQLi, CSRF, Burp Suite, and bug bounty basics.", duration:"5 weeks", yt:"https://youtube.com/results?search_query=web+application+penetration+testing", free:"https://owasp.org/", paid:"https://portswigger.net/web-security" },
    ],
    advanced: [
      { id:"cs-a1", title:"SOC Analyst & SIEM", desc:"Threat hunting, log analysis, SIEM tools, and incident response.", duration:"6 weeks", yt:"https://youtube.com/results?search_query=SOC+analyst+full+course", free:"https://cyberdefenders.org/", paid:"https://www.pluralsight.com/paths/soc-analyst" },
    ]
  },
  datascience: {
    beginner: [
      { id:"ds-b1", title:"Python & Statistics", desc:"Python basics, descriptive stats, distributions, and hypothesis testing.", duration:"4 weeks", yt:"https://youtube.com/results?search_query=statistics+for+data+science", free:"https://www.kaggle.com/learn/python", paid:"https://www.udemy.com/course/statistics-for-data-science-and-business-analysis/" },
    ],
    intermediate: [
      { id:"ds-i1", title:"Data Analysis & Visualization", desc:"Pandas, NumPy, Matplotlib, Seaborn, and Plotly for EDA.", duration:"5 weeks", yt:"https://youtube.com/results?search_query=data+analysis+pandas+full+course", free:"https://www.kaggle.com/learn/pandas", paid:"https://www.udemy.com/course/data-analysis-with-pandas/" },
      { id:"ds-i2", title:"SQL for Data Science", desc:"Complex queries, window functions, CTEs, and database optimization.", duration:"3 weeks", yt:"https://youtube.com/results?search_query=sql+data+science+full+course", free:"https://mode.com/sql-tutorial/", paid:"https://www.udemy.com/course/the-complete-sql-bootcamp/" },
    ],
    advanced: [
      { id:"ds-a1", title:"ML for Data Science", desc:"Feature engineering, ensemble models, cross-validation, and Kaggle strategies.", duration:"8 weeks", yt:"https://youtube.com/results?search_query=machine+learning+for+data+science", free:"https://www.kaggle.com/learn/intro-to-machine-learning", paid:"https://www.coursera.org/specializations/ibm-data-science" },
    ]
  },
  web3: {
    beginner: [
      { id:"w3-b1", title:"Blockchain Fundamentals", desc:"How blockchains work, consensus mechanisms, wallets, and crypto basics.", duration:"3 weeks", yt:"https://youtube.com/results?search_query=blockchain+explained+full+course", free:"https://www.coursera.org/learn/blockchain-basics", paid:"https://www.udemy.com/course/blockchain-and-deep-learning-future-of-ai/" },
    ],
    intermediate: [
      { id:"w3-i1", title:"Solidity & Smart Contracts", desc:"Write, test, and deploy Ethereum smart contracts with Hardhat.", duration:"6 weeks", yt:"https://youtube.com/results?search_query=solidity+full+course", free:"https://cryptozombies.io/", paid:"https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/" },
    ],
    advanced: [
      { id:"w3-a1", title:"DeFi & Web3 Apps", desc:"Build DeFi protocols, NFT marketplaces, and connect with ethers.js.", duration:"8 weeks", yt:"https://youtube.com/results?search_query=defi+development+full+course", free:"https://buildspace.so/", paid:"https://www.alchemy.com/university" },
    ]
  },
  devops: {
    beginner: [
      { id:"do-b1", title:"Linux & Bash Scripting", desc:"Command line mastery, automation scripts, cron jobs, and system administration.", duration:"4 weeks", yt:"https://youtube.com/results?search_query=linux+bash+scripting+full+course", free:"https://linuxupskillchallenge.org/", paid:"https://www.udemy.com/course/linux-mastery/" },
    ],
    intermediate: [
      { id:"do-i1", title:"Docker & Containers", desc:"Containerize applications, Docker Compose, registries, and multi-stage builds.", duration:"4 weeks", yt:"https://youtube.com/results?search_query=docker+full+course", free:"https://docs.docker.com/get-started/", paid:"https://www.udemy.com/course/docker-mastery/" },
      { id:"do-i2", title:"CI/CD Pipelines", desc:"GitHub Actions, Jenkins, automated testing, and deployment workflows.", duration:"3 weeks", yt:"https://youtube.com/results?search_query=github+actions+ci+cd+full+course", free:"https://docs.github.com/en/actions", paid:"https://www.udemy.com/course/github-actions-the-complete-guide/" },
    ],
    advanced: [
      { id:"do-a1", title:"Kubernetes & Cloud", desc:"Orchestration, Helm charts, AWS/GCP/Azure, and Terraform for IaC.", duration:"8 weeks", yt:"https://youtube.com/results?search_query=kubernetes+full+course", free:"https://kubernetes.io/docs/tutorials/", paid:"https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/" },
    ]
  }
};

const CAREER_DATA = [
  { name:"AI / ML Engineer",        demand:"Very High", demandClass:"demand-high", salary:"₹18L – ₹35L/yr",  skills:["Python","TensorFlow","PyTorch","MLOps","SQL","Statistics"],    accent:"linear-gradient(135deg,#ff008a,#6c00ff)" },
  { name:"Cybersecurity Analyst",   demand:"High",      demandClass:"demand-high", salary:"₹10L – ₹22L/yr",  skills:["Kali Linux","Wireshark","SIEM","OWASP","Scripting","Networking"], accent:"linear-gradient(135deg,#00e8ff,#6c00ff)" },
  { name:"Web3 Developer",          demand:"Growing",   demandClass:"demand-med",  salary:"₹14L – ₹28L/yr",  skills:["Solidity","Ethers.js","Rust","DeFi","Smart Contracts","Web3.js"],  accent:"linear-gradient(135deg,#6c00ff,#ff008a)" },
  { name:"Full-Stack Developer",    demand:"Very High", demandClass:"demand-high", salary:"₹8L – ₹20L/yr",   skills:["React","Node.js","PostgreSQL","REST APIs","TypeScript","Docker"],   accent:"linear-gradient(135deg,#ff008a,#ffe000)" },
  { name:"Data Scientist",          demand:"High",      demandClass:"demand-high", salary:"₹12L – ₹24L/yr",  skills:["Python","R","Pandas","Scikit-learn","SQL","Tableau"],               accent:"linear-gradient(135deg,#ffe000,#ff5c00)" },
  { name:"DevOps / Cloud Engineer", demand:"Very High", demandClass:"demand-high", salary:"₹10L – ₹22L/yr",  skills:["Kubernetes","Terraform","AWS","CI/CD","Docker","Linux"],             accent:"linear-gradient(135deg,#00e8ff,#00d98a)" },
];

const AI_RECOMMENDATIONS = {
  "Web Development_30_Beginner":       "Start with HTML & CSS Fundamentals (4 weeks). At 30 min/day take it slow — focus on building 3 small projects before moving on.",
  "Web Development_60_Beginner":       "Start with HTML + CSS and JavaScript in parallel. At 1 hr/day you can finish both in around 8 weeks. Build a portfolio site as your first real project.",
  "Web Development_120_Intermediate":  "Dive into React + Node.js simultaneously. With 2 hrs/day you can go full-stack in 10 weeks. Deploy a CRUD app to Vercel as your capstone.",
  "Artificial Intelligence_60_Beginner":"Start with Python for AI and Khan Academy stats. At 1 hr/day, dedicate 3 months to the foundations. Kaggle competitions are your best friend.",
  "Artificial Intelligence_120_Intermediate":"Jump into ML with scikit-learn first, then deep learning with fast.ai. Build something real — an image classifier or NLP sentiment analyser.",
  "Artificial Intelligence_180_Advanced":"Focus on LLMs and MLOps. Build a RAG pipeline using LangChain and deploy on HuggingFace Spaces. Contribute to open-source AI repos.",
  "Cybersecurity_60_Beginner":         "Start with Networking Fundamentals + Linux basics. At 1 hr/day this takes about 7 weeks. Set up a home lab with VirtualBox for hands-on practice.",
  "Data Science_60_Beginner":          "Python + Statistics first. Use Kaggle Learn — it's free and structured. Aim to publish your first Kaggle notebook by week 3.",
  "Web3_60_Intermediate":              "Jump straight to Solidity on CryptoZombies (free and gamified). At 1 hr/day, deploy your first NFT contract in around 4 weeks.",
  "DevOps_120_Intermediate":           "Docker first, then GitHub Actions CI/CD. At 2 hrs/day you can containerise and automate a project in 5 weeks. Then move to Kubernetes.",
};

// ─── STATE ────────────────────────────────────────────────────
let currentUser = null;

// ─── STORAGE HELPERS ─────────────────────────────────────────
const LS = {
  get: (k)    => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  del: (k)    => localStorage.removeItem(k)
};

function getUserData(username) {
  return LS.get(`sp_user_${username}`) || {
    username, email: "", password: "",
    points: 0, streak: 0, lastLogin: null,
    completed: [], feed: []
  };
}
function saveUserData(data) { LS.set(`sp_user_${data.username}`, data); }

function getAllUsers()        { return LS.get("sp_users") || []; }
function saveAllUsers(users)  { LS.set("sp_users", users); }

// ─── AUTH ─────────────────────────────────────────────────────
function toggleAuth(mode) {
  document.getElementById("login-form").classList.toggle("active",  mode === "login");
  document.getElementById("signup-form").classList.toggle("active", mode === "signup");
  document.getElementById("login-error").textContent  = "";
  document.getElementById("signup-error").textContent = "";
}

function handleSignup() {
  const username = document.getElementById("signup-username").value.trim();
  const email    = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const err      = document.getElementById("signup-error");

  if (!username || !email || !password) { err.textContent = "All fields are required."; return; }
  if (password.length < 6)              { err.textContent = "Password must be at least 6 characters."; return; }

  const users = getAllUsers();
  if (users.find(u => u.username === username)) { err.textContent = "Username already taken."; return; }

  const userData = { username, email, password, points: 0, streak: 0, lastLogin: null, completed: [], feed: [] };
  users.push({ username, email, password });
  saveAllUsers(users);
  saveUserData(userData);
  loginUser(userData);
}

function handleLogin() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const err      = document.getElementById("login-error");

  if (!username || !password) { err.textContent = "Please enter your username and password."; return; }

  const users = getAllUsers();
  const found = users.find(u => u.username === username && u.password === password);
  if (!found) { err.textContent = "Invalid username or password."; return; }

  const userData = getUserData(username);
  loginUser(userData);
}

function loginUser(userData) {
  const today     = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (userData.lastLogin !== today) {
    userData.streak   = (userData.lastLogin === yesterday) ? userData.streak + 1 : 1;
    userData.lastLogin = today;
    saveUserData(userData);
  }

  currentUser = userData;
  LS.set("sp_session", userData.username);

  document.getElementById("auth-overlay").classList.remove("active");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("ai-fab").classList.add("visible");

  populateUI();
  navigate("landing");
}

function handleLogout() {
  LS.del("sp_session");
  currentUser = null;
  document.getElementById("auth-overlay").classList.add("active");
  document.getElementById("app").classList.add("hidden");
  document.getElementById("ai-fab").classList.remove("visible");
  toggleAuth("login");
}

function checkSession() {
  const username = LS.get("sp_session");
  if (username) {
    const userData = getUserData(username);
    if (userData.username) { loginUser(userData); return; }
  }
  document.getElementById("auth-overlay").classList.add("active");
}

// ─── UI ───────────────────────────────────────────────────────
function populateUI() {
  if (!currentUser) return;
  const u = currentUser;
  const initial = u.username[0].toUpperCase();

  // Dots menu
  if (document.getElementById("dots-avatar"))  document.getElementById("dots-avatar").textContent  = initial;
  if (document.getElementById("dots-uname"))   document.getElementById("dots-uname").textContent   = u.username;
  if (document.getElementById("dots-pts"))     document.getElementById("dots-pts").textContent     = u.points + " points";

  // Topbar
  document.getElementById("topbar-user").textContent   = u.username;
  document.getElementById("topbar-streak").textContent = u.streak;

  // Dashboard
  document.getElementById("dash-avatar").textContent   = initial;
  document.getElementById("dash-username").textContent = u.username;
  document.getElementById("dash-email").textContent    = u.email;
  document.getElementById("dash-points").textContent   = u.points;
  document.getElementById("dash-streak").textContent   = u.streak;
  document.getElementById("dash-completed").textContent = u.completed.length;

  renderBadges();
  renderProgressList();
  renderRecommendedGrid();
  renderLeaderboard();
  renderSharePreview();
  renderFeed();
}

function renderBadges() {
  if (!currentUser) return;
  const badges = [];
  if (currentUser.streak >= 7)               badges.push({ label:"7-Day Learner" });
  if (currentUser.streak >= 30)              badges.push({ label:"30-Day Consistent" });
  if (currentUser.completed.length >= 10)    badges.push({ label:"Domain Master" });
  if (currentUser.points >= 500)             badges.push({ label:"Point Hunter" });

  document.getElementById("badge-row").innerHTML = badges.length
    ? badges.map(b => `<span class="badge-chip">${b.label}</span>`).join("")
    : `<span style="color:var(--text3);font-size:0.82rem">Complete courses to earn badges!</span>`;
}

function renderProgressList() {
  if (!currentUser) return;
  const el = document.getElementById("progress-list");
  el.innerHTML = DOMAINS.map(d => {
    const rm    = ROADMAPS[d.id];
    const total = [...rm.beginner, ...rm.intermediate, ...rm.advanced].length;
    const done  = (currentUser.completed || []).filter(id => {
      // match by domain prefix
      const prefix = d.id.slice(0,2);
      return id.startsWith(prefix + "-") || id.startsWith(prefix.slice(0,1));
    }).length;
    const trueDone = [...rm.beginner, ...rm.intermediate, ...rm.advanced]
      .filter(c => (currentUser.completed || []).includes(c.id)).length;
    const pct = total > 0 ? Math.round((trueDone / total) * 100) : 0;
    return `
      <div class="glass-card" style="padding:16px 20px">
        <div class="progress-info">
          <span>${d.name}</span>
          <span>${trueDone}/${total} &nbsp;·&nbsp; ${pct}%</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>`;
  }).join("");
}

function renderRecommendedGrid() {
  const el = document.getElementById("rec-grid");
  if (!el) return;
  const allCourses = [];
  DOMAINS.forEach(d => {
    const rm = ROADMAPS[d.id];
    ["beginner","intermediate","advanced"].forEach(lvl => {
      rm[lvl].forEach(c => allCourses.push({ ...c, domain: d.name, level: lvl }));
    });
  });
  const pending = allCourses.filter(c => !(currentUser.completed || []).includes(c.id)).slice(0, 6);
  el.innerHTML = pending.map(c => `
    <div class="rec-card">
      <div class="rc-level">${c.level} · ${c.domain}</div>
      <h4>${c.title}</h4>
      <p>${c.desc.slice(0,80)}...</p>
      <button class="btn-sm" onclick="navigate('domain')">View Roadmap</button>
    </div>`).join("");
}

// ─── NAVIGATION ───────────────────────────────────────────────
function navigate(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".tab-item").forEach(n => n.classList.remove("active"));

  const el  = document.getElementById(`page-${page}`);
  if (el)  el.classList.add("active");

  const tab = document.querySelector(`.tab-item[data-page="${page}"]`);
  if (tab) tab.classList.add("active");

  if (page === "domain")    loadRoadmap();
  if (page === "career")    renderCareer();
  if (page === "community") { renderLeaderboard(); renderFeed(); }
  if (page === "landing")   renderDomainCards();
  if (page === "dashboard") populateUI();
}

// renamed to avoid clashing with window.scrollTo
function scrollToSection(sel) {
  const el = document.querySelector(sel);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}



// ─── THREE-DOT MENU ──────────────────────────────────────────
function toggleDotsMenu() {
  document.getElementById("dots-dropdown").classList.toggle("open");
}
function closeDotsMenu() {
  document.getElementById("dots-dropdown").classList.remove("open");
}
// Close dots menu when clicking outside
document.addEventListener("click", function(e) {
  if (!e.target.closest(".dots-menu-wrap")) closeDotsMenu();
});

// ─── DOMAIN CARDS ─────────────────────────────────────────────
function renderDomainCards() {
  const el = document.getElementById("domain-cards");
  if (!el) return;
  el.innerHTML = DOMAINS.map(d => `
    <div class="domain-card" style="--card-accent:${d.accent};--card-grad:${d.cardGrad}"
         onclick="navigate('domain');setTimeout(()=>{document.getElementById('domain-select').value='${d.id}';loadRoadmap();},120)">
      <div class="domain-card-header">
        <h3>${d.name}</h3>
        <span class="domain-arrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
      </div>
      <p>${d.desc}</p>
      <div class="domain-meta">
        ${d.tags.map(t => `<span class="tag ${t==="Trending"?"hot":""}">${t}</span>`).join("")}
      </div>
    </div>`).join("");
}

// ─── ROADMAP ─────────────────────────────────────────────────
function loadRoadmap() {
  const domainId = document.getElementById("domain-select").value;
  const roadmap  = ROADMAPS[domainId];
  const el       = document.getElementById("roadmap-container");
  if (!el || !roadmap) return;

  const completed = currentUser ? (currentUser.completed || []) : [];
  const begTotal  = roadmap.beginner.length;
  const intTotal  = roadmap.intermediate.length;
  const begDone   = roadmap.beginner.filter(c => completed.includes(c.id)).length;
  const intDone   = roadmap.intermediate.filter(c => completed.includes(c.id)).length;
  const intUnlock = begDone >= Math.ceil(begTotal / 2);
  const advUnlock = intDone >= Math.ceil(intTotal / 2);

  el.innerHTML = [
    renderLevel("beginner",     "Beginner",     roadmap.beginner,     true,      completed),
    renderLevel("intermediate", "Intermediate", roadmap.intermediate, intUnlock, completed),
    renderLevel("advanced",     "Advanced",     roadmap.advanced,     advUnlock, completed),
  ].join("");
}

function renderLevel(levelKey, label, courses, unlocked, completed) {
  return `
    <div class="roadmap-level">
      <div class="level-header">
        <span class="level-badge ${levelKey}">${label}</span>
        <div class="level-line"></div>
        <span style="font-size:0.8rem;color:var(--text3)">
          ${courses.filter(c => completed.includes(c.id)).length}/${courses.length} done
        </span>
      </div>
      ${unlocked
        ? `<div class="courses-grid">${courses.map(c => renderCourseCard(c, completed.includes(c.id))).join("")}</div>`
        : `<div class="locked-overlay">
             <div class="lock-icon">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
             </div>
             <p>Complete at least half of the previous level to unlock this stage.</p>
           </div>`
      }
    </div>`;
}

function renderCourseCard(course, isDone) {
  return `
    <div class="course-card ${isDone ? "completed" : ""}" id="card-${course.id}">
      <div class="course-card-top">
        <div class="course-title">${course.title}</div>
        ${isDone ? `<span class="completed-badge">Done</span>` : ""}
      </div>
      <div class="course-desc">${course.desc}</div>
      <div class="course-meta">
        <span>${course.duration}</span>
      </div>
      <div class="course-links">
        <a class="link-btn yt"   href="${course.yt}"   target="_blank" rel="noopener">YouTube</a>
        <a class="link-btn free" href="${course.free}" target="_blank" rel="noopener">Free</a>
        <a class="link-btn paid" href="${course.paid}" target="_blank" rel="noopener">Paid</a>
      </div>
      <button class="complete-btn ${isDone ? "done" : ""}" onclick="toggleComplete('${course.id}')">
        ${isDone ? "Completed" : "Mark as complete"}
      </button>
    </div>`;
}

function toggleComplete(courseId) {
  if (!currentUser) return;
  const idx = currentUser.completed.indexOf(courseId);
  if (idx === -1) {
    currentUser.completed.push(courseId);
    currentUser.points += 50;
    showToast("+50 points — course completed.");
  } else {
    currentUser.completed.splice(idx, 1);
    currentUser.points = Math.max(0, currentUser.points - 50);
  }
  saveUserData(currentUser);
  populateUI();
  loadRoadmap();
}

// ─── CAREER ──────────────────────────────────────────────────
function renderCareer() {
  const el = document.getElementById("career-grid");
  if (!el) return;
  el.innerHTML = CAREER_DATA.map(c => `
    <div class="career-card" style="--c-accent:${c.accent}">
      <h3>${c.name}</h3>
      <div class="cc-demand ${c.demandClass}">${c.demand} Demand</div>
      <div class="career-salary">${c.salary}</div>
      <div class="career-salary-label">Average salary range (India market)</div>
      <div class="skills-title">Required Skills</div>
      <div class="skills-list">
        ${c.skills.map(s => `<span class="skill-pill">${s}</span>`).join("")}
      </div>
    </div>`).join("");
}

// ─── COMMUNITY ───────────────────────────────────────────────
function renderLeaderboard() {
  const el = document.getElementById("leaderboard-list");
  if (!el) return;
  const users = getAllUsers();
  const lb = users.map(u => {
    const d = getUserData(u.username);
    return { username: d.username, points: d.points, streak: d.streak };
  }).sort((a, b) => b.points - a.points).slice(0, 10);

  const rankClasses = ["gold","silver","bronze"];
  const rankLabels  = ["1","2","3"];

  el.innerHTML = lb.length
    ? lb.map((u, i) => `
        <div class="lb-item">
          <div class="lb-rank ${rankClasses[i] || ""}">${rankLabels[i] || (i + 1)}</div>
          <div class="lb-avatar">${u.username[0].toUpperCase()}</div>
          <div class="lb-info">
            <div class="lb-name">${u.username}${u.username === currentUser?.username ? " (You)" : ""}</div>
            <div class="lb-pts">${u.points} pts</div>
          </div>
          <div class="lb-streak">${u.streak} day streak</div>
        </div>`).join("")
    : `<p style="color:var(--text3);font-size:0.85rem;padding:12px 0">No users yet — be the first!</p>`;
}

function renderSharePreview() {
  const el = document.getElementById("share-preview");
  if (!el || !currentUser) return;
  el.innerHTML = `
    <strong>${currentUser.username}</strong> &nbsp;&middot;&nbsp; ${currentUser.points} pts &nbsp;&middot;&nbsp; ${currentUser.streak} day streak<br>
    ${currentUser.completed.length} courses completed
  `;
}

function shareProgress() {
  if (!currentUser) return;
  const msg = document.getElementById("share-msg").value.trim();
  if (!msg) { showToast("Write something first."); return; }

  currentUser.feed = currentUser.feed || [];
  currentUser.feed.unshift({
    user: currentUser.username,
    msg,
    time: new Date().toLocaleString()
  });
  saveUserData(currentUser);
  document.getElementById("share-msg").value = "";
  renderFeed();
  showToast("Update posted.");
}

function renderFeed() {
  const el = document.getElementById("community-feed");
  if (!el || !currentUser) return;
  const feed = currentUser.feed || [];
  el.innerHTML = feed.length
    ? feed.map(f => `
        <div class="feed-item">
          <div class="fi-user">${f.user}</div>
          <div class="fi-msg">${escHtml(f.msg)}</div>
          <div class="fi-time">${f.time}</div>
        </div>`).join("")
    : `<p style="color:var(--text3);font-size:0.82rem;text-align:center;padding:20px 0">Share your first update above!</p>`;
}

function escHtml(s) {
  return String(s)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");
}

// ─── SEARCH ──────────────────────────────────────────────────
const ALL_COURSES = [];
DOMAINS.forEach(d => {
  const rm = ROADMAPS[d.id];
  ["beginner","intermediate","advanced"].forEach(lvl => {
    rm[lvl].forEach(c => ALL_COURSES.push({ ...c, domain: d.name, domainId: d.id, level: lvl }));
  });
});

function handleSearch() {
  const query    = document.getElementById("search-input").value.trim().toLowerCase();
  const dropdown = document.getElementById("search-results");
  if (!query) { dropdown.classList.add("hidden"); return; }

  const results = ALL_COURSES.filter(c =>
    c.title.toLowerCase().includes(query) ||
    c.domain.toLowerCase().includes(query) ||
    c.desc.toLowerCase().includes(query)
  ).slice(0, 8);

  dropdown.innerHTML = results.length
    ? results.map(r => `
        <div class="search-item" onclick="gotoSearchResult('${r.domainId}')">
          <strong>${r.title}</strong>
          <div class="s-domain">${r.domain} · ${r.level}</div>
        </div>`).join("")
    : `<div class="search-item" style="color:var(--text3)">No results found</div>`;

  dropdown.classList.remove("hidden");
}

function gotoSearchResult(domainId) {
  document.getElementById("search-input").value = "";
  document.getElementById("search-results").classList.add("hidden");
  navigate("domain");
  setTimeout(() => {
    document.getElementById("domain-select").value = domainId;
    loadRoadmap();
  }, 150);
}

document.addEventListener("click", e => {
  if (!e.target.closest(".search-wrap")) {
    document.getElementById("search-results").classList.add("hidden");
  }
});

// ─── AI MODAL ────────────────────────────────────────────────
function openAiModal()  { document.getElementById("ai-modal").classList.remove("hidden"); document.getElementById("ai-result").classList.add("hidden"); }
function closeAiModal() { document.getElementById("ai-modal").classList.add("hidden"); }

function getAiRecommendation() {
  const interest = document.getElementById("ai-interest").value;
  const time     = document.getElementById("ai-time").value;
  const level    = document.getElementById("ai-level").value;
  const key      = `${interest}_${time}_${level}`;
  const result   = document.getElementById("ai-result");

  const rec = AI_RECOMMENDATIONS[key] ||
    `Based on your interest in <strong>${interest}</strong>, ${time} min/day availability, and <strong>${level}</strong> skill level:
    <br><br>We recommend starting with the <strong>${interest}</strong> roadmap on SkillPath.
    At your pace you can complete one course every ${Math.ceil(240 / parseInt(time))} weeks.
    Focus on hands-on projects early — they accelerate learning more than any other habit.`;

  result.innerHTML = rec;
  result.classList.remove("hidden");
}

// ─── TOAST ───────────────────────────────────────────────────
function showToast(msg) {
  const existing = document.getElementById("sp-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "sp-toast";
  Object.assign(toast.style, {
    position:   "fixed",
    bottom:     "90px",
    right:      "24px",
    zIndex:     "9999",
    background: "var(--accent)",
    color:      "#ffffff",
    padding:    "12px 22px",
    borderRadius:"50px",
    fontSize:   "0.88rem",
    fontWeight: "600",
    boxShadow:  "0 4px 20px rgba(255,60,172,0.35)",
    fontFamily: "var(--font-body)",
    animation:  "slideUp 0.3s ease",
  });
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
}

// ─── KEYBOARD SHORTCUTS ──────────────────────────────────────
// ─── CHATBOT ────────────────────────────────────────────────
const CHAT_API = "/api/chat";

function openChatbot() {
  document.getElementById("chatbot-wrap").classList.add("open");
  const welcome = document.getElementById("cb-welcome");
  if (welcome) welcome.style.display = "";
}

function closeChatbot() {
  document.getElementById("chatbot-wrap").classList.remove("open");
}

function renderMarkdown(text) {
  return text
    .replace(/^### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^## (.+)$/gm, "<h3>$1</h3>")
    .replace(/^# (.+)$/gm, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\n/g, "<br>");
}

function appendMsg(role, text) {
  const wrap = document.getElementById("chatbot-msgs");
  const welcome = document.getElementById("cb-welcome");
  if (welcome) welcome.style.display = "none";

  const div = document.createElement("div");
  div.className = `cb-msg ${role}`;
  div.innerHTML = renderMarkdown(text);
  wrap.appendChild(div);
  wrap.scrollTop = wrap.scrollHeight;
}

function createStreamingMsg() {
  const wrap = document.getElementById("chatbot-msgs");
  const welcome = document.getElementById("cb-welcome");
  if (welcome) welcome.style.display = "none";

  const div = document.createElement("div");
  div.className = "cb-msg bot";
  div.innerHTML = "";
  wrap.appendChild(div);
  wrap.scrollTop = wrap.scrollHeight;
  return { div, wrap };
}

async function sendChatMessage() {
  const input = document.getElementById("chatbot-input");
  const sendBtn = document.getElementById("chatbot-send");
  const msg = input.value.trim();
  if (!msg) return;

  const username = currentUser ? currentUser.username : "Learner";
  appendMsg("user", `${username}: ${msg}`);
  input.value = "";
  sendBtn.disabled = true;

  try {
    const res = await fetch(CHAT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Check if response body is readable (SSE stream) or plain JSON
    const contentType = res.headers.get("content-type") || "";

    if (res.body && typeof res.body.getReader === "function" && contentType.includes("text/event-stream")) {
      // SSE streaming response
      const { div: msgEl, wrap } = createStreamingMsg();
      let full = "";

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let lineBuf = "";

      const readChunk = ({ value, done }) => {
        if (done) {
          sendBtn.disabled = false;
          return;
        }

        const chunk = decoder.decode(value, { stream: true });
        lineBuf += chunk;

        const lines = lineBuf.split("\n");
        lineBuf = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6).trim();
          if (!data) continue;

          try {
            const json = JSON.parse(data);
            const reply = json?.reply;
            if (reply) {
              full += reply;
              msgEl.innerHTML = renderMarkdown(full);
              wrap.scrollTop = wrap.scrollHeight;
            }
          } catch { /* skip partial JSON */ }
        }

        reader.read().then(readChunk);
      };

      reader.read().then(readChunk);
    } else {
      // Plain JSON response (Netlify non-streaming)
      const data = await res.json();
      if (data.reply) {
        appendMsg("bot", data.reply);
      } else if (data.error) {
        appendMsg("bot", `Error: ${data.error}`);
      }
      sendBtn.disabled = false;
    }
  } catch (err) {
    appendMsg("bot", `Sorry, something went wrong (${err.message}). Please try again.`);
    sendBtn.disabled = false;
  }
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeChatbot();
    closeAiModal();
    document.getElementById("search-results").classList.add("hidden");
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    document.getElementById("search-input").focus();
  }
});

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderDomainCards();
  checkSession();
});
