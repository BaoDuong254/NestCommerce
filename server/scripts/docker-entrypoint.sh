#!/bin/sh
set -e

echo "🔄 Starting NestCommerce Server initialization..."

# Wait for database to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until pg_isready -h ${DB_HOST:-db} -p ${DB_PORT:-5432} -U ${DB_USER} -q; do
  echo "⏳ PostgreSQL is unavailable - sleeping"
  sleep 2
done
echo "✅ PostgreSQL is ready!"

# Generate Prisma Client with actual DATABASE_URL
echo "🔄 Generating Prisma Client..."
pnpm exec prisma generate

# Run Prisma migrations
echo "🔄 Running Prisma migrations..."
pnpm exec prisma migrate deploy

# Run database seed
echo "🌱 Seeding database..."
pnpm run seed

echo "🚀 Starting NestJS server..."
# Start the server
pnpm run start:prod
