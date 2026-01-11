# HackMate 🚀💕

A CLI-first social network and dating platform designed for developers. Connect, collaborate, code—and maybe find love—all from your terminal.

## 🎯 What is HackMate?

HackMate is a terminal-based social platform where developers can:
- 💘 **Date** other developers with GitHub-powered matching
- 🤝 **Connect** with like-minded hackers based on tech stack and interests
- 💬 **Chat** in real-time via DMs and group channels
- 🚀 **Collaborate** on projects and find team members
- 👥 **Join** developer communities and groups
- 🌐 **Network** through friend requests and following

Think of it as "Tinder + LinkedIn + Discord for terminal lovers."

### 🌟 Unique Dating Features

HackMate isn't just another dating app - it matches you based on:
- **GitHub Compatibility**: Shared programming languages, repos, and coding activity
- **Tech Stack**: Find people who work with the same technologies
- **Hobbies & Interests**: Connect over shared passions beyond coding
- **Location**: Discover developers in your city or country
- **Traditional Preferences**: Age range, orientation, and relationship goals

[Learn more about dating features →](docs/DATING_FEATURES.md)

## 📦 Project Structure

This repository contains two standalone applications:

```
hackmate/
├── server/           # Fastify API + Socket.IO backend
└── cli/              # Interactive terminal client (React + Ink)
```

Each directory is a **complete, independent application** with its own:
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `README.md` - Detailed documentation
- `.env.example` - Environment configuration template

## 🚀 Quick Start

### 1. Start the Server

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB, Redis, and SMTP credentials
npm run dev
```

Server runs on `http://localhost:3001`

### 2. Install & Run CLI

```bash
cd cli
npm install
npm run build
npm link

# Now use the CLI
hackmate auth signup
hackmate chat
hackmate discover
```

## � Dating Quick Example

### Create a dating profile:
```bash
POST /api/auth/signup
{
  "username": "devlover",
  "email": "dev@example.com",
  "password": "secure123",
  "intent": "dating",
  "age": 28,
  "gender": "female",
  "city": "San Francisco",
  "lookingFor": "relationship",
  "orientation": "straight",
  "interestedIn": ["male"],
  "ageRangeMin": 25,
  "ageRangeMax": 35,
  "stack": ["React", "Node.js", "Python"],
  "hobbies": ["hiking", "photography", "cooking"],
  "github": "devlover123"
}
```

### Discover matches:
```bash
GET /api/match/discover
# Returns top compatible developers with scores and match reasons

GET /api/match/top?city=San Francisco&minScore=60
# Filter by location and compatibility threshold
```

**[See full dating guide →](docs/DATING_FEATURES.md)**

## 📚 Documentation

- **[Dating Features](docs/DATING_FEATURES.md)** - Complete dating guide, matching algorithm
- **[Server Documentation](server/README.md)** - API setup, endpoints, deployment
- **[CLI Documentation](cli/README.md)** - Installation, commands, usage
- **[User Manual](docs/HACKMATE_MANUAL.md)** - Complete feature guide
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment

## ✨ Key Features

### 💘 Dating & Matching
- GitHub-powered compatibility scoring (100-point algorithm)
- Match on tech stack, hobbies, location, age, and preferences
- Filter by city, age range, orientation, and relationship goals
- Detailed match reasons (shared languages, skills, interests)
- Sync GitHub profile for automatic analysis

### Authentication & Profiles
- Email-based signup with OTP verification
- JWT authentication
- Comprehensive profiles (dating preferences, hobbies, tech stack, socials)
- Age, gender, orientation, and preference settings

### Real-time Chat
- Direct messaging via Socket.IO
- Group chat channels
- Online presence indicators
- Message history

### Social Networking
- Friend requests and following
- User discovery based on matching tech stacks
- Block/unblock users
- Friend lists

### Projects & Collaboration
- Post project ideas
- Browse open projects
- Apply to join teams
- Accept/reject applicants

### Communities
- Create and join groups
- Group messaging
- Interest-based communities

### Admin Tools
- User management
- Ban/delete users
- Promote to admin

## 🛠️ Tech Stack

### Server
- **Fastify** - Fast, low-overhead Node.js framework
- **MongoDB** - Document database with Mongoose ODM
- **Redis** - Caching and session management
- **Socket.IO** - Real-time WebSocket communication
- **Zod** - Runtime type validation
- **Argon2** - Password hashing
- **JWT** - Token-based authentication

### CLI
- **React + Ink** - Build terminal UIs with React
- **Commander** - CLI framework
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time connection
- **Chalk** - Terminal colors
- **Conf** - Config management

## 📖 Common Commands

```bash
# Authentication
hackmate auth signup         # Create account
hackmate auth login          # Login
hackmate auth logout         # Logout

# Networking
hackmate discover            # Find developers
hackmate social follow <user> # Send friend request

# Chat
hackmate chat                # Open chat interface
hackmate chat dm <user>      # Direct message

# Projects
hackmate project list        # Browse projects
hackmate project create      # Post a project

# Groups
hackmate group list          # List communities
hackmate group join <id>     # Join a group

# Admin
hackmate admin users list    # List all users (admin only)
```

## 🔧 Development

### Server Development
```bash
cd server
npm install
npm run dev    # Runs with tsx watch mode
```

### CLI Development
```bash
cd cli
npm install
npm run dev    # Runs with tsx watch mode
```

## 🐳 Docker Deployment

```bash
cd server
docker-compose up -d
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for production setup.

## 📋 Requirements

- **Node.js** >= 20
- **MongoDB** (local or Atlas)
- **Redis** (local or Upstash)
- **SMTP Server** (optional, for email verification)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT

## 🙏 Acknowledgments

Built with love for the terminal-dwelling developer community.

---

**Ready to connect?** Start with `hackmate auth signup` and join the network!
