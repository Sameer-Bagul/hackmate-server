# HackMate CLI 💻

Interactive terminal-based social network for developers and hackers.

## Features

- 🎨 **Beautiful TUI** - Built with React + Ink
- 🔐 **Complete Auth Flow** - Signup → Email verification → Profile setup
- 💬 **Real-time Chat** - DMs and group messaging via Socket.IO
- 🌐 **Networking** - Connect with developers, send/accept friend requests
- 🛠️ **Projects** - Browse and apply to projects, find collaborators
- 👥 **Communities** - Join interest-based groups
- 🔔 **Notifications** - Stay updated on friend requests and messages
- ⚡ **Admin Tools** - Manage users (admin-only)

## Prerequisites

- Node.js >= 20
- HackMate Server running (see `../server`)

## Installation

### Option 1: Install Globally

```bash
# Install dependencies and build
npm install
npm run build

# Link globally
npm link

# Now use anywhere
hackmate --help
```

### Option 2: Run Locally

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Or build and run
npm run build
npm start
```

## Usage

### First Time Setup

```bash
# Sign up and create account
hackmate auth signup

# This will:
# 1. Create your account
# 2. Send verification OTP (check email or server console)
# 3. Verify email
# 4. Setup your profile (bio, skills, tech stack, etc.)
```

### Authentication

```bash
hackmate auth login          # Login to existing account
hackmate auth logout         # Logout
hackmate auth whoami         # Check current user
hackmate auth verify         # Manually verify email
```

### Profile Management

```bash
hackmate profile view                 # View your profile
hackmate profile view <username>      # View another user's profile
hackmate profile edit                 # Update your profile
```

### Social Network

```bash
hackmate discover                     # Discover developers with matching interests
hackmate social list                  # List your friends
hackmate social follow <username>     # Send friend request
hackmate social requests              # View/manage pending requests
hackmate social block <username>      # Block a user
```

### Chat & Messaging

```bash
hackmate chat                         # Open main chat interface
hackmate chat dm <username>           # Direct message a user
hackmate chat group <groupname>       # Open group chat
```

### Projects

```bash
hackmate project list                 # Browse open projects
hackmate project create               # Post a new project
hackmate project view <id>            # View project details
hackmate project apply <id>           # Apply to join a project
hackmate project accept <id> <uid>    # Accept applicant (owner only)
```

### Groups & Communities

```bash
hackmate group list                   # List available groups
hackmate group create                 # Create new community
hackmate group join <id>              # Join a group
```

### Admin Commands

```bash
hackmate admin users list             # List all users
hackmate admin users view <id>        # View user details
hackmate admin users delete <id>      # Delete/ban user
```

## Configuration

The CLI stores credentials locally using the `conf` package.

Config location:
- Linux: `~/.config/hackmate-cli/config.json`
- macOS: `~/Library/Preferences/hackmate-cli/config.json`
- Windows: `%APPDATA%\hackmate-cli\Config\config.json`

### Environment Variables

Create `.env` file (optional):

```env
API_URL=http://localhost:3001
SOCKET_URL=http://localhost:3001
```

## Project Structure

```
cli/
├── src/
│   ├── commands/              # CLI command screens
│   │   ├── auth/              # Authentication flows
│   │   ├── profile/           # Profile management
│   │   ├── chat/              # Chat interface
│   │   ├── network/           # Social networking
│   │   ├── project/           # Project browsing
│   │   ├── group/             # Group management
│   │   └── admin/             # Admin panel
│   ├── components/            # Reusable Ink components
│   ├── context/               # React context providers
│   │   ├── AuthContext.tsx    # Auth state management
│   │   └── SocketContext.tsx  # Socket.IO connection
│   ├── api.ts                 # Axios API client
│   ├── config.ts              # Config management
│   └── cli.tsx                # CLI entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Development

```bash
# Run in watch mode
npm run dev

# Build TypeScript
npm run build

# Lint
npm run lint
```

## Troubleshooting

### Connection Issues

If you can't connect to the server:

1. Ensure server is running: `cd ../server && npm run dev`
2. Check `API_URL` in config or environment
3. Verify server is accessible: `curl http://localhost:3001`

### Authentication Errors

If you're logged out unexpectedly:

```bash
# Clear config and login again
rm -rf ~/.config/hackmate-cli/
hackmate auth login
```

### Socket.IO Issues

If real-time features aren't working:

1. Check server logs for Socket.IO connection
2. Verify WebSocket isn't blocked by firewall
3. Try reconnecting by restarting the CLI

## Tips

- Use Tab to navigate between options in interactive menus
- Press Ctrl+C to exit any screen
- Most screens auto-refresh on updates
- Real-time notifications appear automatically

## License

MIT
