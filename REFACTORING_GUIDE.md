# HackMate Refactoring Guide

## Overview
This document guides you through the refactored codebase structure for better maintainability, testability, and scalability.

## 🏗️ New Structure

### Server Architecture

```
server/src/
├── api/                          # HTTP Layer (Presentation)
│   ├── routes/                   # Route definitions
│   │   ├── auth.routes.ts
│   │   ├── match.routes.ts
│   │   ├── profile.routes.ts
│   │   ├── chat.routes.ts
│   │   └── index.ts
│   ├── controllers/              # Request/Response handlers
│   │   ├── auth.controller.ts
│   │   ├── match.controller.ts    ✅ DONE
│   │   └── profile.controller.ts
│   └── middlewares/              # Custom middlewares
│       └── auth.middleware.ts
│
├── core/                         # Business Logic Layer
│   └── services/                 # Business logic
│       ├── auth.service.ts
│       ├── match.service.ts       ✅ MOVED
│       └── github.service.ts      ✅ MOVED
│
├── infrastructure/               # External Dependencies
│   ├── database/
│   │   ├── models/               ✅ MOVED (from src/models)
│   │   │   ├── User.ts
│   │   │   ├── Profile.ts
│   │   │   └── index.ts
│   │   └── mongodb.config.ts     ✅ MOVED (from plugins/infra)
│   ├── cache/
│   │   └── redis.config.ts       ✅ MOVED
│   ├── socket/
│   │   ├── socket.config.ts      ✅ MOVED
│   │   └── socket.service.ts     ✅ MOVED
│   └── email/
│       └── email.service.ts      ✅ MOVED
│
├── shared/                       # Shared Utilities
│   ├── validators/               ✅ MOVED (from src/schemas)
│   │   ├── auth.ts
│   │   ├── profile.ts
│   │   └── index.ts
│   ├── types/
│   └── utils/
│
└── config/                       # Configuration
    ├── cors.ts                   ✅ MOVED (from plugins/security)
    ├── helmet.ts                 ✅ MOVED
    ├── jwt.ts                    ✅ MOVED
    ├── rateLimit.ts              ✅ MOVED
    └── sensible.ts               ✅ MOVED
```

### CLI Architecture

```
cli/src/
├── features/                     # Feature Modules
│   ├── auth/
│   │   ├── components/          # UI Components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── VerifyOTP.tsx
│   │   ├── api/                 # API calls
│   │   │   └── auth.api.ts
│   │   ├── hooks/               # Custom hooks
│   │   │   └── useAuth.ts
│   │   └── index.tsx            # Feature entry
│   │
│   ├── match/
│   │   ├── components/
│   │   │   ├── MatchCard.tsx
│   │   │   └── MatchList.tsx
│   │   ├── api/
│   │   │   └── match.api.ts
│   │   └── index.tsx
│   │
│   ├── chat/
│   ├── profile/
│   └── ...
│
├── shared/                       # Shared Resources
│   ├── components/              # Reusable UI
│   ├── hooks/                   # Shared hooks
│   ├── utils/                   # Utilities
│   └── types/                   # TypeScript types
│
└── context/                      # Global State
    ├── AuthContext.tsx
    └── SocketContext.tsx
```

## 📝 Migration Status

### Completed ✅
- [x] Created new directory structure (server & CLI)
- [x] Moved database models to `infrastructure/database/models`
- [x] Moved schemas to `shared/validators`
- [x] Moved services to appropriate locations
- [x] Moved infrastructure plugins to `infrastructure/`
- [x] Moved security configs to `config/`
- [x] Refactored match module (controller + routes separation)

### Pending 🔄
#### Server
- [ ] Refactor auth module (split into controller + routes + service)
- [ ] Refactor profile module
- [ ] Refactor chat module
- [ ] Refactor group module
- [ ] Refactor network module
- [ ] Refactor project module
- [ ] Refactor admin module
- [ ] Refactor notification module
- [ ] Update all import paths across codebase
- [ ] Update app.ts to use new structure
- [ ] Update start.ts
- [ ] Update all scripts (seed-admin, seed-profiles, etc.)
- [ ] Test compilation

#### CLI
- [ ] Extract auth API calls to `features/auth/api/auth.api.ts`
- [ ] Extract auth logic to hooks
- [ ] Split auth screens into feature components
- [ ] Repeat for all features (match, chat, profile, etc.)
- [ ] Create shared components
- [ ] Create shared hooks (useApi, useSocket)
- [ ] Update cli.tsx
- [ ] Test build

## 🎯 Next Steps

### Step 1: Complete Server Refactoring

**For each module**, follow this pattern:

#### Example: Auth Module

**1. Create Service** (`core/services/auth.service.ts`)
```typescript
export class AuthService {
    async signup(data: SignupData) {
        // Business logic only
    }
    
    async login(credentials: LoginCredentials) {
        // Business logic only
    }
}
```

**2. Create Controller** (`api/controllers/auth.controller.ts`)
```typescript
export class AuthController {
    async signup(request: FastifyRequest, reply: FastifyReply) {
        const data = SignupSchema.parse(request.body);
        const result = await authService.signup(data);
        return result;
    }
}
```

**3. Create Routes** (`api/routes/auth.routes.ts`)
```typescript
const authRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post('/signup', authController.signup);
    fastify.post('/login', authController.login);
};
```

### Step 2: Update Import Paths

All imports need updating:
```typescript
// OLD
import { UserModel } from '../../models/index.js';
import { SignupSchema } from '../../schemas/index.js';
import { calculateMatchScore } from './service.js';

// NEW
import { UserModel } from '../../infrastructure/database/models/index.js';
import { SignupSchema } from '../../shared/validators/index.js';
import { calculateMatchScore } from '../../core/services/match.service.js';
```

### Step 3: Update App.ts

```typescript
// Register routes
await fastify.register(authRoutes, { prefix: '/api/auth' });
await fastify.register(matchRoutes, { prefix: '/api/match' });
await fastify.register(profileRoutes, { prefix: '/api/profile' });
// ... etc
```

### Step 4: CLI Feature Extraction

**For each feature**, extract:

**1. API Layer** (`features/auth/api/auth.api.ts`)
```typescript
export const authApi = {
    signup: async (data: SignupData) => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },
    
    login: async (credentials: LoginCredentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    }
};
```

**2. Hooks** (`features/auth/hooks/useAuth.ts`)
```typescript
export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    
    const signup = async (data: SignupData) => {
        setLoading(true);
        try {
            const result = await authApi.signup(data);
            // Handle success
        } finally {
            setLoading(false);
        }
    };
    
    return { signup, loading };
};
```

**3. Components** (`features/auth/components/SignupForm.tsx`)
```typescript
export const SignupForm = () => {
    const { signup, loading } = useAuth();
    
    // Just UI logic
};
```

## 🔧 Commands to Complete Migration

### Auto-update imports (after manual refactoring)
```bash
# Find all TypeScript files with old imports
cd server/src
find . -name "*.ts" -exec sed -i "s|from '../../models/|from '../../infrastructure/database/models/|g" {} +
find . -name "*.ts" -exec sed -i "s|from '../../schemas/|from '../../shared/validators/|g" {} +
find . -name "*.ts" -exec sed -i "s|from '../../services/|from '../../core/services/|g" {} +
```

### Verify no old imports remain
```bash
grep -r "from '../../models/" server/src/
grep -r "from '../../schemas/" server/src/
grep -r "from '../../services/githubService" server/src/
```

## 📊 Benefits Achieved

✅ **Separation of Concerns**
- Routes: Just route definitions
- Controllers: Request/response handling
- Services: Pure business logic
- Models: Data access only

✅ **Testability**
- Services can be unit tested without Fastify
- Controllers can be tested with mocked services
- Clear dependencies

✅ **Maintainability**
- Find code by layer (route → controller → service)
- Changes don't ripple across layers
- Easy to add new features

✅ **Scalability**
- Add new modules without touching existing code
- Clear patterns to follow
- Reusable components

## 🐛 Debugging Guide

### "Cannot find module" errors
1. Check import path matches new structure
2. Ensure file has `.js` extension in import
3. Verify file exists at new location

### "Model not registered" errors
1. Check models index exports all models
2. Ensure connectDB is called before using models
3. Verify import uses new path

### Tests failing
1. Update test imports to new structure
2. Mock dependencies at service layer
3. Use dependency injection for testability

## 📚 Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Feature-Based Organization](https://feature-sliced.design/)
- [Fastify Best Practices](https://www.fastify.io/docs/latest/Guides/Getting-Started/)
- [React Feature Folder Structure](https://reactjs.org/docs/faq-structure.html)

---

**Next TODO**: Complete auth module refactoring following match module pattern
