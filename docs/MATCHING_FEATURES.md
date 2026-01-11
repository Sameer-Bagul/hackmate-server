# 💝 HackMate Matching & Dating Features

## Overview

HackMate uses **GitHub-powered matching** to connect developers based on:
- 💻 Programming languages & tech stack
- 🎯 Intent (dating, networking, collaboration)
- 📍 Location
- ⚡ GitHub activity & skills
- 🔧 Project topics & interests

## 🎯 Matching API Endpoints

### 1. **Discover Compatible Developers**
```http
GET /match/discover
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "username": "alice",
    "score": 85,
    "compatibilityPercentage": 85,
    "matchReasons": [
      "🎯 Same intent: dating",
      "💻 Shared tech (5): JavaScript, Python, React, Node.js, MongoDB",
      "📍 Same location: San Francisco",
      "🔧 Common languages (3): TypeScript, JavaScript, Python"
    ],
    "githubScore": 42,
    "bio": "Full-stack developer...",
    "stack": ["JavaScript", "React", "Node.js"],
    "location": "San Francisco"
  }
]
```

---

### 2. **Top Matches with Filters**
```http
GET /match/top?limit=10&city=Mumbai&minScore=50
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` - Number of matches (default: 10)
- `city` - Filter by city name
- `country` - Filter by country
- `minScore` - Minimum compatibility score (0-100)

**Example:**
```bash
GET /match/top?limit=5&city=Bangalore&minScore=60
GET /match/top?limit=20&country=India
```

---

### 3. **Compare Two Developers**
```http
GET /match/compare/:username1/:username2
Authorization: Bearer <token>
```

**Example:**
```bash
GET /match/compare/sameer/alice
```

**Response:**
```json
{
  "user1": {
    "username": "sameer",
    "profile": { /* profile data */ },
    "github": {
      "profile": { /* GitHub profile */ },
      "languages": { "JavaScript": 45, "Python": 30 },
      "totalStars": 523,
      "skills": ["React", "Node.js", "AI/ML"]
    }
  },
  "user2": { /* similar structure */ },
  "compatibility": {
    "score": 78,
    "percentage": 78,
    "reasons": [
      "🎯 Same intent: dating",
      "💻 Shared tech (4): React, Node.js, MongoDB, TypeScript",
      "🔧 Common languages (3): JavaScript, Python, TypeScript",
      "📊 Similar GitHub activity level"
    ]
  },
  "detailed": {
    "user1_to_user2": {
      "score": 80,
      "percentage": 80,
      "reasons": [...]
    },
    "user2_to_user1": {
      "score": 76,
      "percentage": 76,
      "reasons": [...]
    }
  }
}
```

---

### 4. **Sync GitHub Data**
```http
POST /match/sync-github
Authorization: Bearer <token>
```

Fetches and syncs your GitHub profile data:
- Languages you use
- Skills from repo topics
- Location, bio
- Activity metrics

**Response:**
```json
{
  "message": "GitHub data synced successfully",
  "profile": { /* updated profile */ },
  "githubData": {
    "languages": { "JavaScript": 50, "Python": 35, "Go": 15 },
    "totalStars": 1234,
    "totalCommits": 89,
    "skills": ["React", "Node.js", "Docker", "Kubernetes"]
  }
}
```

---

### 5. **GitHub Analysis for Any User**
```http
GET /match/github/:username
Authorization: Bearer <token>
```

**Example:**
```bash
GET /match/github/torvalds
```

**Response:**
```json
{
  "profile": {
    "login": "torvalds",
    "name": "Linus Torvalds",
    "bio": "Creator of Linux",
    "location": "Portland, OR",
    "public_repos": 7,
    "followers": 200000
  },
  "languages": { "C": 90, "Shell": 10 },
  "topRepos": [
    {
      "name": "linux",
      "language": "C",
      "stargazers_count": 150000,
      "topics": ["kernel", "operating-system"]
    }
  ],
  "totalStars": 151234,
  "skills": ["C", "Shell", "kernel", "operating-system"]
}
```

---

## 📊 Matching Algorithm

### Scoring Breakdown (Max 100 points)

| Category | Max Points | Description |
|----------|-----------|-------------|
| **Intent Match** | 30 | Same relationship goal (dating, networking, collab) |
| **Tech Stack** | 25 | Overlap in programming languages/frameworks |
| **Location** | 15 | Same city (15pts) or nearby (8pts) |
| **GitHub Languages** | 15 | Common programming languages on GitHub |
| **GitHub Skills** | 10 | Shared repo topics and skills |
| **Activity Level** | 5 | Similar GitHub activity/contribution levels |

### Compatibility Percentage
```
Percentage = (Total Score / 100) × 100
```

**Ranges:**
- 🔥 90-100% - Excellent match
- ❤️ 75-89% - Great match
- 💛 60-74% - Good match
- 💚 50-59% - Moderate match
- 💙 <50% - Low match

---

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install axios
```

### 2. Configure Profile with GitHub Username
Users must set their GitHub username in profile:
```json
{
  "github": "your-github-username"
}
```

### 3. Sync GitHub Data (Optional but Recommended)
```bash
POST /match/sync-github
```

---

## 💡 Usage Examples

### Find Top 5 Matches in Your City
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/match/top?limit=5&city=Mumbai&minScore=70"
```

### Compare Yourself with Another Developer
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/match/compare/yourname/theirname"
```

### Sync Your GitHub Profile
```bash
curl -X POST -H "Authorization: Bearer <token>" \
  "http://localhost:3001/match/sync-github"
```

---

## 🎨 CLI Commands (Planned)

```bash
# Find matches
hackmate match discover
hackmate match top 10 --city Mumbai --min-score 70

# Compare profiles
hackmate match compare <username1> <username2>

# Sync GitHub
hackmate match sync-github

# View GitHub stats
hackmate match github <username>
```

---

## 📝 Notes

- GitHub API has rate limits (60 req/hour unauthenticated, 5000 with token)
- Consider caching GitHub data to avoid rate limits
- Sync GitHub data periodically (daily/weekly)
- GitHub data is optional but highly recommended for better matches

---

## 🚀 Future Enhancements

- [ ] Add GitHub OAuth for higher rate limits
- [ ] Cache GitHub data in database
- [ ] ML-based matching improvements
- [ ] Contribution graph analysis
- [ ] Code style similarity
- [ ] GitHub star history trends
- [ ] Mutual followers/following analysis
