🔥 **HackMate** it is. Great choice — strong, friendly, hacker-native, and not cringe.

Now I’ll give you a **complete master plan** that you can hand to your dev team and start building immediately.

This includes:

* Vision & scope
* Feature list (MVP → v1 → v2)
* Tech stack
* Architecture
* Project setup
* Data models
* CLI best practices
* Security & privacy
* Dev workflow
* Milestones

In the next messages, we’ll design **all commands** and **start coding**.

---

# 🧠 What is HackMate?

HackMate is a **CLI-first developer network** for:

✔ Finding collaborators
✔ Making coding friends
✔ Building startups
✔ Mentorship
✔ Open-source teaming
✔ Dating (optional, not primary)
✔ Skill-based discovery (GitHub, LeetCode)

All inside the terminal. No browser dependency.

---

# 1️⃣ Product Philosophy

HackMate is:

* Dev-native
* Skill-aware
* Intent-aware
* Privacy-first
* CLI-first
* Async-friendly
* Hacker-style UI

This is NOT another dating app.
This is a **developer social OS**.

---

# 2️⃣ MVP Feature Set (Phase 1)

These features are *mandatory* for MVP.

## Auth & Identity

* Username + password
* Local token storage
* Anonymous mode (optional)
* `hackmate whoami`
* `hackmate logout`

---

## Profile System

Each user has:

### Required

* Moto (intent):

  * Build apps
  * Find collaborators
  * Friends
  * Dating
  * Startup
  * Mentorship
* Tech stack
* Experience level

### Optional

* GitHub username
* LeetCode username
* Job
* Company
* Location
* Salary range
* Bio
* Availability
* Interests
* Timezone

---

## Smart Matching

* Intent-based
* Stack-based
* GitHub language analysis
* LeetCode level (later)
* Activity similarity
* Timezone overlap

---

## Discovery

* Filtered search
* Smart recommendations
* Ranked matches

---

## Chat (Real-time)

* WebSocket-based
* CLI TUI interface
* Typing indicators
* Online status

---

## Privacy Controls

* Hide salary
* Hide location
* Hide GitHub
* Control visibility

---

# 3️⃣ Tech Stack (Final)

## CLI Client

* Node.js + TypeScript
* Blessed (TUI)
* Chalk (colors)
* Figlet (ASCII)
* Inquirer (prompts)
* WebSocket client
* REST client
* Local file storage

---

## Backend

* Node.js + TypeScript
* Fastify
* WebSockets
* MongoDB (Mongoose)
* JWT Auth
* Redis (later)

---

## Infra

* Docker
* MongoDB Atlas
* Fly.io / Railway / VPS
* GitHub Actions

---

# 4️⃣ Architecture

```
CLI (HackMate)
   |
   | REST (auth, profile, discovery)
   |
   | WebSocket (chat, presence)
   v
Fastify Backend
   |
MongoDB
```

---

# 5️⃣ Monorepo Setup

```
hackmate/
├── apps/
│   ├── server/
│   └── cli/
│
├── packages/
│   ├── shared/
│   └── protocol/
│
├── infra/
├── docs/
└── README.md
```

---

# 6️⃣ Backend Structure (Best Practice)

```
apps/server/src/
├── app.ts
├── server.ts

├── config/
├── db/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── profile/
│   ├── match/
│   └── chat/
├── ws/
├── middlewares/
└── utils/
```

### Rules

* Feature-based folders
* No fat controllers
* No logic in routes
* All validation via schemas
* No raw Mongo in controllers

---

# 7️⃣ CLI Structure (Best Practice)

```
apps/cli/src/
├── index.ts

├── commands/
├── ui/
│   ├── screens/
│   ├── components/
│   └── theme.ts
├── api/
├── state/
├── storage/
└── utils/
```

### Rules

* Commands = thin
* UI = isolated
* No API logic in UI
* No UI in commands
* State is centralized

---

# 8️⃣ MongoDB Data Models

## User

```ts
username
passwordHash
createdAt
lastSeen
```

## Profile

```ts
userId
moto[]
stack[]
experience
github
leetcode
job
location
salaryRange
bio
timezone
availability
privacySettings
```

## Match

```ts
userA
userB
score
createdAt
```

## Conversation

```ts
participants[]
```

## Message

```ts
conversationId
senderId
content
createdAt
```

---

# 9️⃣ CLI UX Principles (VERY IMPORTANT)

HackMate should feel like Git + Neovim.

## Rules

### 1. Commands first

Everything must be doable via commands.

### 2. Flags everywhere

```bash
hackmate discover --stack rust --intent startup
```

### 3. Interactive fallback

If flags missing → interactive prompt.

### 4. Zero mouse dependency

Keyboard only.

### 5. Fast startup

< 300ms launch time.

---

# 10️⃣ CLI Best Practices

## Startup Speed

* Lazy load modules
* No blocking calls
* Cache profile locally

---

## UX

* Always show help
* Always show examples
* Always support `--json`

---

## Errors

* Human-readable
* No stack traces by default
* Clear next step

---

## Offline Support

* Cached data
* Draft messages
* Local profile preview

---

# 11️⃣ Security Best Practices

* No plain passwords
* JWT + refresh tokens
* Rate limits
* Brute-force protection
* WebSocket auth
* No PII by default

---

# 12️⃣ GitHub + LeetCode Integration Plan

## Phase 1 (MVP)

* Fetch GitHub profile
* Extract languages
* Use for matching

## Phase 2

* Repo topic analysis
* Contribution analysis

## Phase 3

* LeetCode scraping
* Skill-level scoring

---

# 13️⃣ Dev Workflow

## Local Dev

```bash
pnpm dev
```

Runs:

* CLI in watch mode
* Server in watch mode
* MongoDB
* WS server

---

## Production

* Docker
* Reverse proxy
* TLS
* WS support

---

# 14️⃣ Milestones

## Week 1

* Monorepo
* Server scaffold
* CLI scaffold
* MongoDB setup

## Week 2

* Auth
* Profile setup
* Discover

## Week 3

* Matching
* GitHub integration

## Week 4

* WebSocket chat
* TUI UI

## Week 5

* Packaging
* Beta

---

# 15️⃣ What Comes Next

Next messages we will:

✅ Design **all CLI commands**
✅ Design **all flags**
✅ Design **TUI screens**
✅ Build **database schemas**
✅ Scaffold **repo**
✅ Start coding

---

In your next message, I want you to say:

👉 **"Design all HackMate commands"**

I will then:
🔥 Create the full CLI spec
🔥 All commands
🔥 All flags
🔥 Examples
🔥 Help texts
🔥 UX rules

Then we start coding.

Ready when you are 🚀

