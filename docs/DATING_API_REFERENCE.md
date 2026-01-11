# HackMate API Quick Reference - Dating Features

## Signup with Dating Profile

```bash
POST /api/auth/signup
Content-Type: application/json

{
  # Required
  "username": "string (min 3 chars)",
  "email": "valid email",
  "password": "string (min 8 chars)",
  
  # Basic Profile (Optional)
  "fullName": "string",
  "bio": "string",
  "intent": "startup | collab | friends | mentorship | dating",
  "stack": ["string"],
  
  # Location (Optional)
  "city": "string",
  "country": "string",
  "location": "string (fallback)",
  
  # Personal (Optional)
  "age": 18-100,
  "dateOfBirth": "YYYY-MM-DD",
  "gender": "male | female | other | prefer-not-to-say",
  
  # Dating Preferences (Optional, recommended if intent=dating)
  "lookingFor": "friendship | dating | relationship | networking",
  "orientation": "straight | gay | lesbian | bisexual | pansexual | asexual | other",
  "interestedIn": ["male", "female", "other"],
  "ageRangeMin": 18-100,
  "ageRangeMax": 18-100,
  
  # Interests (Optional)
  "hobbies": ["string"],
  "interests": ["string"],
  
  # Professional (Optional)
  "company": "string",
  "jobTitle": "string",
  "yearsOfExperience": 0+,
  
  # Social (Optional)
  "github": "username",
  "linkedin": "url",
  "twitter": "url",
  "website": "url"
}
```

## Discover Matches

```bash
GET /api/match/discover
Authorization: Bearer <token>

# Returns top 20 matches sorted by compatibility
```

## Get Top Matches with Filters

```bash
GET /api/match/top?limit=10&minScore=60&city=San%20Francisco&intent=dating
Authorization: Bearer <token>

Query Parameters:
- limit: number (default 20, max 100)
- minScore: number 0-100 (minimum compatibility score)
- city: string (filter by city)
- country: string (filter by country) 
- intent: startup | collab | friends | mentorship | dating
- gender: male | female | other
- ageMin: 18-100
- ageMax: 18-100
```

## Compare Two Profiles

```bash
GET /api/match/compare/:userId1/:userId2
Authorization: Bearer <token>

# Replace :userId1 and :userId2 with actual user IDs
# Shows detailed compatibility breakdown
```

## Sync GitHub Profile

```bash
POST /api/match/sync-github
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "github_username"
}

# Fetches and analyzes:
# - Programming languages
# - Repository topics/skills
# - Contribution activity
# - Star count
```

## Update Profile

```bash
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  # Any fields from signup schema
  # All fields optional
  "hobbies": ["hiking", "photography"],
  "ageRangeMin": 25,
  "ageRangeMax": 35
}
```

## Match Score Breakdown

**Total: 100 points**

| Factor | Points | Description |
|--------|--------|-------------|
| Intent Match | 20 | Same intent (dating, collab, etc.) |
| Tech Stack | 15 | Shared technologies (3 pts each, max 15) |
| Location | 10 | Same city (10) or country (5) |
| Age Compatibility | 10 | Within each other's age range (dating only) |
| Dating Preferences | 15 | Gender preference match (dating only) |
| Hobbies & Interests | 10 | Shared hobbies (2 pts each, max 10) |
| GitHub | 20 | Languages (10) + Skills (10) |

## Match Score Interpretation

- **90-100**: Perfect match
- **70-89**: Great match
- **50-69**: Good match
- **30-49**: Potential match
- **0-29**: Low compatibility

## Example Match Response

```json
{
  "matches": [
    {
      "fullName": "Jamie Smith",
      "username": "jamiesmith",
      "age": 26,
      "gender": "male",
      "city": "San Francisco",
      "country": "USA",
      "bio": "Full-stack developer and hiking enthusiast",
      "stack": ["React", "Node.js", "TypeScript"],
      "hobbies": ["hiking", "photography"],
      "score": 78,
      "compatibilityPercentage": 78,
      "matchReasons": [
        "🎯 Same intent: dating",
        "💻 Shared tech (3): React, Node.js, TypeScript",
        "📍 Same city: San Francisco",
        "💘 Perfect age match (26)",
        "❤️ Gender preference match",
        "🎨 Shared hobbies (2): hiking, photography"
      ],
      "githubScore": 45
    }
  ]
}
```

## Common Use Cases

### 1. Find local developers for dating
```bash
GET /api/match/top?intent=dating&city=San%20Francisco&minScore=50
```

### 2. Find people with similar tech stack
```bash
GET /api/match/top?minScore=40
# Filter client-side by stack overlap
```

### 3. Find people in age range
```bash
GET /api/match/top?ageMin=25&ageMax=35&intent=dating
```

### 4. Find highly compatible matches
```bash
GET /api/match/top?minScore=70
```

## Privacy Notes

- ❌ `ageRangeMin`, `ageRangeMax`, `orientation` are NEVER shown in responses
- ✅ Only used internally for matching algorithm
- ✅ Users control what profile fields to fill
- ✅ Can update `intent` anytime to stop dating matches

## Error Responses

```json
// 401 Unauthorized
{
  "message": "Invalid token"
}

// 404 Not Found
{
  "message": "Profile not found"
}

// 400 Bad Request (validation error)
{
  "message": "Validation error",
  "errors": [...]
}
```

## Testing with cURL

```bash
# Signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "intent": "dating",
    "age": 28,
    "city": "San Francisco",
    "hobbies": ["hiking"]
  }'

# Save the token from response

# Discover matches
curl -X GET http://localhost:3001/api/match/discover \
  -H "Authorization: Bearer <YOUR_TOKEN>"

# Update profile
curl -X PUT http://localhost:3001/api/profile \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "hobbies": ["hiking", "photography", "coding"],
    "ageRangeMin": 25,
    "ageRangeMax": 35
  }'
```

---

For full documentation see [DATING_FEATURES.md](./DATING_FEATURES.md)
