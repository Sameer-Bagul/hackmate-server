FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 1. Prune: Scope only the necessary packages for the API
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
# Prunes the monorepo to include only 'api' dependencies
RUN turbo prune --scope=api --docker

# 2. Install & Build: Uses the pruned lockfile for optimal caching
FROM base AS builder
WORKDIR /app

# Copy lockfile and package.json's from pruner
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies (only what's needed for API)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy source code from pruner
COPY --from=pruner /app/out/full/ .

# Build dependencies explicitly (to ensure types are ready) and then the API
RUN pnpm turbo run build --filter=api...

# 3. Runner: Minimal production image
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Copy only the necessary build artifacts
# Note: For a true standalone runner in monorepo, we often copy node_modules from builder.
# A more advanced setup would be 'pnpm deploy', but keeping it simple and robust for now.
COPY --from=builder --chown=nestjs:nodejs /app .

EXPOSE 3001
CMD ["node", "apps/api/dist/start.js"]
