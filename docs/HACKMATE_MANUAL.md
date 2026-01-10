# HackMate - The Terminal Social Network for Developers 🚀

HackMate is a CLI-first social network designed for hackers and developers. It allows users to connect, chat, collaborate on projects, and join communities—all from the terminal.

## 📂 Project Structure

The project is a Monorepo managed by **TurboRepo** and **pNPM**.

```
hackmate/
├── apps/
│   ├── api/                 # Fastify Node.js Backend
│   │   ├── src/modules/     # Feature-based modules (Auth, Chat, Network, etc.)
│   │   ├── src/plugins/     # Infra plugins (MongoDB, Redis, Socket.IO)
│   │   └── src/services/    # Shared services (SocketManager)
│   │
│   └── cli/                 # Interactive CLI (React + Ink)
│       ├── src/commands/    # CLI Command Screens & Logic
│       ├── src/ui/          # Reusable Ink Components
│       └── src/api.ts       # Axios Client Configuration
│
├── packages/
│   ├── db/                  # Shared Mongoose Models (User, Profile, Chat, etc.)
│   └── shared/              # Shared Zod Schemas & TypeScript Interfaces
│
└── docs/                    # Documentation
```

---

## ✨ Features & CLI Commands

### 1. Authentication & Onboarding
Seamless flow for signing up, verifying email, and setting up your profile.

| Command | Description |
| :--- | :--- |
| `hackmate auth signup` | **Start Here!** Creates account, verifies email (OTP), and sets up profile. |
| `hackmate auth login` | Login with existing credentials. |
| `hackmate auth verify` | Verify email manually (if skipped during signup). |
| `hackmate auth logout` | Clear local session. |
| `hackmate auth whoami` | Show current user status. |

### 2. Profile Management
Showcase your skills, tech stack, and bio to the network.

| Command | Description |
| :--- | :--- |
| `hackmate profile view` | View your own profile. |
| `hackmate profile view [username]` | View another user's profile. |
| `hackmate profile edit` | Update your bio, skills, socials, etc. |

### 3. Chat & Messaging 💬
Real-time messaging using Socket.IO.

| Command | Description |
| :--- | :--- |
| `hackmate chat` | Open the main chat interface. |
| `hackmate chat dm <username>` | Open a Direct Message with a user. |
| `hackmate chat group <groupname>` | Open a Group Chat. |

### 4. Social Network 🌐
Connect with other developers.

| Command | Description |
| :--- | :--- |
| `hackmate social list` | List your friends and followers. |
| `hackmate social follow <username>` | Follow a user (sends friend request). |
| `hackmate social requests` | View and accept/reject pending requests. |
| `hackmate social block <username>` | Block a user. |
| `hackmate discover` | Find new developers to connect with. |

### 5. Projects 🛠️
Find collaborators or post your own ideas.

| Command | Description |
| :--- | :--- |
| `hackmate project list` | Browse open projects. |
| `hackmate project create` | Post a new project. |
| `hackmate project view <id>` | View project details. |
| `hackmate project apply <id>` | Apply to join a project. |
| `hackmate project accept <id> <uid>` | Accept an applicant (Project Owner only). |

### 6. Groups & Communities 📢
Join interest-based communities.

| Command | Description |
| :--- | :--- |
| `hackmate group list` | List available groups. |
| `hackmate group create` | Create a new community. |
| `hackmate group join <id>` | Join a group. |

### 7. Admin (God Mode) ⚡
Administrative tools for managing the platform.

| Command | Description |
| :--- | :--- |
| `hackmate admin users list` | List all users. |
| `hackmate admin users view <id>` | View user details. |
| `hackmate admin users delete <id>` | Ban/Delete a user. |

---

## 🛠️ Development Setup

**Prerequisites:** Node.js, pNPM, MongoDB, Redis.

1.  **Install Dependencies:**
    ```bash
    pnpm install
    ```
2.  **Environment Variables:**
    Set up `.env` in `apps/api/` with MongoDB URI, Redis URL, and SMTP credentials.
3.  **Start Dev Server:**
    ```bash
    pnpm dev
    ```
    *(Runs both API and CLI in watch mode, though CLI is best tested by running `hackmate` commands directly)*
4.  **Build & Link CLI:**
    ```bash
    pnpm --filter hackmate-cli build
    cd apps/cli && npm link
    ```
