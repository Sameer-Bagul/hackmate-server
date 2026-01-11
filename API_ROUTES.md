# 🗺️ Complete API Route Map

## Base URL
All routes are prefixed with `/api`

---

## 🔐 Authentication Routes
**Prefix:** `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| POST | `/otp/send` | Send OTP email | ❌ |
| POST | `/otp/verify` | Verify OTP code | ❌ |

---

## 💕 Match Routes
**Prefix:** `/api/match`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/discover` | Discover potential matches | ✅ |
| GET | `/top` | Get top matches | ✅ |
| POST | `/compare/:userId` | Compare profiles | ✅ |
| POST | `/github/sync` | Sync GitHub data | ✅ |
| GET | `/github/analysis` | Get GitHub analysis | ✅ |

---

## 👤 Profile Routes
**Prefix:** `/api/profile`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get own profile | ✅ |
| PUT | `/` | Update profile | ✅ |
| GET | `/:username` | Get public profile | ✅ |

---

## 💬 Chat Routes
**Prefix:** `/api/chat`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/history/:userId` | Get direct messages | ✅ |
| GET | `/history/group/:groupId` | Get group messages | ✅ |
| GET | `/conversations` | Get all conversations | ✅ |

---

## 👥 Group Routes
**Prefix:** `/api/groups`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create group | ✅ |
| GET | `/` | List all groups | ✅ |
| GET | `/:id` | Get group details | ✅ |
| POST | `/:id/join` | Join group | ✅ |
| POST | `/:id/accept` | Accept join request | ✅ (Admin) |
| POST | `/:id/reject` | Reject join request | ✅ (Admin) |
| POST | `/:id/kick` | Kick member | ✅ (Admin) |
| POST | `/:id/leave` | Leave group | ✅ |

---

## 🤝 Network Routes
**Prefix:** `/api/network`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/request` | Send friend request | ✅ |
| GET | `/requests` | List incoming requests | ✅ |
| POST | `/accept` | Accept friend request | ✅ |
| POST | `/reject` | Reject friend request | ✅ |
| GET | `/friends` | List friends | ✅ |
| POST | `/block` | Block user | ✅ |

---

## 🚀 Project Routes
**Prefix:** `/api/projects`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create project | ✅ |
| GET | `/` | List open projects | ✅ |
| GET | `/:id` | Get project details | ✅ |
| POST | `/:id/apply` | Apply to project | ✅ |
| POST | `/:id/accept` | Accept applicant | ✅ (Owner) |
| POST | `/:id/reject` | Reject applicant | ✅ (Owner) |
| DELETE | `/:id` | Delete project | ✅ (Owner) |

---

## 🔔 Notification Routes
**Prefix:** `/api/notifications`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List notifications | ✅ |
| POST | `/:id/read` | Mark as read | ✅ |

---

## 🛡️ Admin Routes
**Prefix:** `/api/admin`
**Note:** All admin routes require `role: admin`

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List all users |
| GET | `/users/:id` | View user details |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

### Statistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Dashboard statistics |
| GET | `/activity` | Recent activity log |
| GET | `/search` | Search (users/groups/projects) |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/messages` | List all messages |
| GET | `/messages/user/:userId` | Messages by user |
| DELETE | `/messages/:id` | Delete message |

### Groups
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/groups` | List all groups |
| GET | `/groups/:id` | Group details |
| DELETE | `/groups/:id` | Delete group |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List all projects |
| GET | `/projects/:id` | Project details |
| DELETE | `/projects/:id` | Delete project |

### Friend Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/friend-requests` | List all requests |
| DELETE | `/friend-requests/:id` | Delete request |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | List all notifications |
| DELETE | `/notifications/:id` | Delete notification |

---

## 🏥 System Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | ❌ |

---

## 📝 Request/Response Examples

### Authentication
```bash
# Signup
POST /api/auth/signup
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123",
  "intent": "dating",
  "githubUsername": "johndoe"
}

# Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

### Profile
```bash
# Get own profile
GET /api/profile/
Headers: { Authorization: "Bearer <token>" }

# Update profile
PUT /api/profile/
{
  "bio": "Full-stack developer",
  "skills": ["React", "Node.js"],
  "location": "Mumbai, India"
}
```

### Match
```bash
# Discover matches
GET /api/match/discover?limit=10&intent=dating

# Compare profiles
POST /api/match/compare/65abc123def456
```

### Groups
```bash
# Create group
POST /api/groups/
{
  "name": "React Developers",
  "description": "Learning React together",
  "isPrivate": false
}

# Join group
POST /api/groups/65abc123/join
```

---

## 🔑 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

Get token from:
- `/api/auth/login` - Returns token on successful login
- `/api/auth/signup` - Returns token after registration

---

## 📊 Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success"
}
```

### Error Response
```json
{
  "error": "Error message",
  "statusCode": 400
}
```

---

## 🎯 Quick Reference

**Total Endpoints:** 65+
- Auth: 4
- Match: 5
- Profile: 3
- Chat: 3
- Groups: 8
- Network: 6
- Projects: 7
- Notifications: 2
- Admin: 25+
- System: 1

**Authentication Required:** 60+ endpoints
**Public Endpoints:** 5 (auth routes + health)
**Admin Only:** 25+ endpoints
