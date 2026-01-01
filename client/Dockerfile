# Build stage
FROM node:24-alpine AS builder

# Set workdir to parent to have workspace structure
WORKDIR /workspace

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

# Copy workspace config and patches first
COPY pnpm-workspace.yaml ./
COPY patches ./patches

# Setup client directory
WORKDIR /workspace/client

# Copy package files
COPY client/package.json ./
COPY client/tsconfig*.json ./
COPY client/vite.config.ts ./

# Install dependencies (generate lockfile in CI)
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY client/public ./public
COPY client/src ./src
COPY client/scripts ./scripts
COPY client/index.html ./

# Build the application
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx configuration
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /workspace/client/dist /usr/share/nginx/html

# Expose ports
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
