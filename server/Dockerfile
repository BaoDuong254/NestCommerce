# Build stage
FROM node:24-alpine AS builder

# Set workdir to parent to have workspace structure
WORKDIR /workspace

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy workspace config and patches first
COPY pnpm-workspace.yaml ./
COPY patches ./patches

# Setup server directory
WORKDIR /workspace/server

# Copy package files from server/
COPY server/package.json ./
COPY server/tsconfig*.json ./
COPY server/prisma.config.ts ./
COPY server/nest-cli.json ./

# Install dependencies (generate lockfile in CI)
RUN pnpm install --frozen-lockfile

# Install NestJS CLI globally for build command
RUN npm install -g @nestjs/cli

# Copy Prisma schema and generate client
COPY server/prisma ./prisma
# Set a dummy DATABASE_URL for prisma generate (not used during generation)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
RUN pnpm exec prisma generate

# Copy source code
COPY server/src ./src

# Build the application
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm run build

# Production stage
FROM node:24-alpine

WORKDIR /app

# Install OpenSSL for Prisma, wget for healthcheck, and postgresql-client for pg_isready
RUN apk add --no-cache openssl wget postgresql-client

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

# Copy package files
COPY server/package.json ./
COPY server/prisma.config.ts ./

# Install production dependencies (no workspace needed here)
RUN pnpm install --frozen-lockfile --prod

# Copy Prisma schema
COPY server/prisma ./prisma

# Copy built application from builder
COPY --from=builder /workspace/server/dist ./dist

# Copy generated Prisma client from builder
COPY --from=builder /workspace/server/generated ./generated

# Copy seed scripts for database initialization
COPY server/scripts ./scripts

# Copy and set permissions for entrypoint script
COPY server/scripts/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Expose port 3000 for NestJS server
EXPOSE 3000

# Use entrypoint script to run migrations, seed, and start server
CMD ["/bin/sh", "/app/docker-entrypoint.sh"]
