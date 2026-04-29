# SkillPath — Project Reference

## Overview

**SkillPath** is a gamified, frontend-only learning platform with a built-in AI chatbot. Users authenticate via localStorage, follow structured roadmaps across 6 domains, earn points/streaks/badges, and chat with an AI study assistant.

**Stack:** Pure HTML/CSS/JS — no framework, no build step. A Node.js server (`server.js`) serves the static files and proxies AI requests during local dev. For Vercel deployment, `api/chat.js` is the serverless function.

---

## File Structure

```
/home/s3c/dti-project/web-portal/
├── index.html        — SPA HTML shell (auth overlay + 5 pages + chatbot UI)
├── style.css         — All styles (~894 lines). White-light neon-bright theme.
├── app.js            — All JS logic (~813 lines): auth, navigation, rendering, chatbot
├── server.js         — Local dev server with SSE proxy for /api/chat
├── api/
│   └── chat.js      — Vercel serverless function (Anthropic SDK proxy)
├── package.json      — ESM module, dependencies: @anthropic-ai/sdk, puppeteer
├── vercel.json       — Rewrite rules for SPA routing
└── test-chatbot.mjs  — Puppeteer end-to-end test (not part of production)
```

---

## Architecture

### Authentication & State
- User accounts stored in `localStorage` as JSON
- `LS.get/set/del` helpers wrap `localStorage` with JSON parse/stringify
- `sp_users` array stores `{username, email, password}` for login validation
- `sp_user_<username>` stores full user data: `{username, email, password, points, streak, lastLogin, completed[], feed[]}`
- `sp_session` key stores currently logged-in username
- `currentUser` global holds the active user object in memory

### Pages (SPA)
| ID | Page | Key Features |
|----|------|-------------|
| `landing` | Home | Hero, domain cards (from `DOMAINS`), "How it works" steps |
| `dashboard` | Dashboard | Avatar, stats (points/streak/completed), badges, domain progress bars, recommendations |
| `domain` | Roadmap | Domain selector (6 domains), 3-tier course grid (beginner/intermediate/advanced), progress-gated unlocks, YouTube/free/paid links |
| `community` | Community | Leaderboard (top 10 by points), share progress feed |
| `career` | Career | 6 career cards (salary, demand, skills) from `CAREER_DATA` |

### Data Models

**`DOMAINS`** — 6 domains: `webdev`, `ai`, `cybersec`, `datascience`, `web3`, `devops`
Each has: `id, name, desc, tags[], accent (hex), cardGrad`

**`ROADMAPS`** — per-domain, 3 levels each:
```js
{ domainId: { beginner: [{id, title, desc, duration, yt, free, paid}], intermediate: [...], advanced: [...] } }
```

**`CAREER_DATA`** — 6 careers: `{name, demand, demandClass, salary, skills[], accent}`

**`AI_RECOMMENDATIONS`** — static map for the "AI Course Recommender" modal: key = `Interest_Time_Level`, value = recommendation string

### Gamification
- **Points:** +50 per course completed, -50 on un-complete
- **Streak:** increment on consecutive days, reset if a day is missed
- **Badges:** 7-Day Learner, 30-Day Consistent, Domain Master (10+ courses), Point Hunter (500+ pts)
- **Progress gating:** Intermediate unlocks when ≥50% of Beginner courses done; Advanced when ≥50% of Intermediate done

---

## Components

### Auth Overlay (`#auth-overlay`)
- Full-screen, fixed, z-index 9999
- Animated floating orbs in background
- Two-column layout: brand column + form column
- Login form and Signup form toggled via `toggleAuth()`
- Stored credentials checked against `sp_users` + `sp_user_<username>`

### Three-Dot Menu (`#dots-menu-wrap`)
- Fixed top-left, z-index 1000
- Dropdown with user avatar, username, points, nav links, sign-out

### Top Bar (`.topbar`)
- Sticky, frosted glass effect
- Search input (Ctrl+K shortcut) with live dropdown results
- Streak badge + user chip on right

### AI FAB (`#ai-fab`)
- Fixed bottom-right, pink gradient
- Visible only when logged in (`visible` class)
- Opens `#ai-modal`

### AI Modal (`#ai-modal`)
- Interest/time/level dropdowns → static recommendation lookup
- "Open Study Chatbot" button below "Get recommendation"

### Study Chatbot (`#chatbot-wrap`)
- Fixed bottom-right, frosted glass card, z-index 600
- Header with "Study Chatbot" title + close button
- Scrollable messages area (`.cb-msg` bubbles — `.user` and `.bot`)
- Input row with text field + Send button
- **Markdown rendering:** `renderMarkdown()` converts `# ## ###`, `**bold**`, `*italic*`, `` `code` ``, `- list`, `1. list` to styled HTML

---

## API: Chatbot

### Local Dev (`server.js`)
```
POST /api/chat
Body: { message: string }
Response: SSE stream
  data: {"reply":"token text"}\n\n  (repeating per token)
  data: [DONE]\n\n
```

### Vercel (`api/chat.js`)
```
POST /api/chat
Body: { message: string }
Response: SSE stream (same format as local)
```
Uses Anthropic SDK (`@anthropic-ai/sdk`) with:
- `baseURL: https://api.minimax.io/anthropic`
- `model: MiniMax-M2.7`
- `max_tokens: 500`
- API key hardcoded (expires in ~5 days from project creation)

### Frontend (`app.js` `sendChatMessage()`)
- `fetch(CHAT_API, { stream: true })`
- Recursive promise pattern: reads chunks, decodes SSE, parses `{"reply": "text"}`, accumulates into `msgEl.innerHTML`
- Uses `renderMarkdown()` to display formatted responses
- Send button disabled during streaming, re-enabled on `done`

### Markdown Renderer (`renderMarkdown()`)
Converts markdown to HTML for chatbot messages:
- `# / ## / ###` → `<h2>` / `<h3>` / `<h4>`
- `**text**` → `<strong>`
- `*text*` → `<em>`
- `` `code` `` → `<code>`
- `- item` → `<li>` wrapped in `<ul>`
- `1. item` → `<li>` wrapped in `<ol>`
- `\n` → `<br>`

---

## CSS Design System

**Theme:** White Light Mode — white backgrounds, neon bright accents

**Colors (CSS variables):**
```
--pink:    #ff008a   (primary)
--cyan:    #00e8ff
--yellow:  #ffe000
--violet:  #6c00ff
--green:   #00d98a
--red:     #ff2244
--bg:      #ffffff
--text:    #0a0020
--text2:   #5a4f7a
--text3:   #9b90bb
```

**Gradients:**
```css
--g-main:  linear-gradient(#ff008a, #6c00ff, #00e8ff)
--g-warm:  linear-gradient(#ff008a, #ff5c00, #ffe000)
--g-cool:  linear-gradient(#6c00ff, #00e8ff)
```

**Fonts:**
- Headings: `Sora` (Google Fonts)
- Body: `Plus Jakarta Sans` (Google Fonts)
- Mono: `IBM Plex Mono`

**Animations:**
- `orbFloat` — auth orbs float animation
- `fadeUp` — modal/card entrance
- `dropDown` — dots dropdown slide-in

**Scrollbar:** Pink-tinted, 5px wide

---

## Key Functions

### Auth
- `handleSignup()` — validates, creates user in LS, calls `loginUser()`
- `handleLogin()` — finds user, validates password, calls `loginUser()`
- `loginUser(userData)` — sets streak, updates LS, shows `#app`, hides overlay
- `handleLogout()` — clears session, shows auth overlay
- `checkSession()` — restores session on page load

### Navigation
- `navigate(page)` — switches active page tab + section, triggers per-page renders

### Rendering
- `renderDomainCards()` — renders `DOMAINS` array into grid
- `renderProgressList()` — renders per-domain progress bars
- `renderRecommendedGrid()` — shows pending courses
- `renderLeaderboard()` — top 10 users by points
- `renderSharePreview()` — current user stats preview
- `renderFeed()` — user's community feed
- `renderCareer()` — renders `CAREER_DATA`
- `renderBadges()` — earns/awards badge chips

### Roadmap
- `loadRoadmap()` — builds domain roadmap with unlock logic
- `renderLevel()` — renders one level section (with lock overlay if gated)
- `renderCourseCard()` — renders a course with links + complete button
- `toggleComplete(courseId)` — marks done/undone, updates points

### Chatbot
- `openChatbot()` / `closeChatbot()` — show/hide chatbot panel
- `renderMarkdown(text)` — converts markdown to HTML
- `appendMsg(role, text)` — appends a non-streaming message bubble
- `createStreamingMsg()` — creates bot bubble element for live updates
- `sendChatMessage()` — streams user message, fetches `/api/chat`, SSE parsing loop

### Utilities
- `escHtml(s)` — XSS protection for user-generated feed text
- `showToast(msg)` — 3-second toast notification
- `scrollToSection(sel)` — smooth scroll to section

---

## Keyboard Shortcuts
- `Escape` — closes chatbot, closes AI modal, clears search
- `Ctrl/Cmd + K` — focuses search input

---

## Responsive Breakpoints
| Width | Changes |
|-------|---------|
| ≤1100px | Dashboard grid → 2 cols |
| ≤900px | Community grid → 1 col; auth brand col hidden |
| ≤768px | Page padding reduced; topbar left-aligns |
| ≤480px | Dashboard grid → 1 col; hero CTA stacks |

---

## External Dependencies (loaded via CDN)
- Google Fonts: `Plus Jakarta Sans`, `Sora`
- No npm JS packages in the browser — pure vanilla JS

## Node.js Dependencies (server + Vercel)
- `@anthropic-ai/sdk` — Anthropic SDK for MiniMax-M2.7 API
- `puppeteer` — E2E testing only (dev dependency)

---

## Deployment

### Local
```bash
node server.js
# → http://localhost:3000
```

### Vercel
1. Push to GitHub
2. Import repo in Vercel
3. Deploy — `api/chat.js` auto-deploys as serverless function
4. API key is hardcoded in `api/chat.js` (server-side only, never exposed to client)
