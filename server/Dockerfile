# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package.json ./
COPY tsconfig.json ./
COPY prisma.config.ts ./

# Install dependencies (generate lockfile in CI)
RUN pnpm install --no-frozen-lockfile

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY src ./src

# Generate swagger bundle and build the application
RUN pnpm run bundle:swagger && pnpm run build

# Production stage
FROM node:24-alpine

WORKDIR /app

# Install OpenSSL for Prisma, wget for healthcheck, and postgresql-client for pg_isready
RUN apk add --no-cache openssl wget postgresql-client

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

# Copy package files
COPY package.json ./
COPY prisma.config.ts ./

# Install production dependencies
RUN pnpm install --no-frozen-lockfile --prod

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy generated Prisma client from builder
COPY --from=builder /app/generated ./generated

# Copy seed scripts for database initialization
COPY scripts ./scripts

# Copy and set permissions for entrypoint script
COPY scripts/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Expose port 3000 for NestJS server
EXPOSE 3000

# Use entrypoint script to run migrations, seed, and start server
CMD ["/bin/sh", "/app/docker-entrypoint.sh"]
