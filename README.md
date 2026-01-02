# NestCommerce

A comprehensive e-commerce platform built with modern technologies. Features product management, order processing, user authentication, and real-time communication. Built as a full-stack monorepo application.

## 📋 Table of Contents

- [NestCommerce](#nestcommerce)
  - [📋 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🛠 Tech Stack](#-tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [DevOps \& Tools](#devops--tools)
  - [🛠 System Requirements](#-system-requirements)
    - [Install pnpm](#install-pnpm)
  - [🚀 Project Installation](#-project-installation)
    - [1. Clone repository](#1-clone-repository)
    - [2. Install dependencies](#2-install-dependencies)
  - [🏃‍♂️ Running the Project](#️-running-the-project)
    - [Development mode](#development-mode)
    - [First-time setup](#first-time-setup)
    - [Production build](#production-build)
  - [📚 API Documentation](#-api-documentation)
    - [Accessing API Docs](#accessing-api-docs)
  - [📮 Testing with Postman](#-testing-with-postman)
    - [Setup](#setup)
    - [Features](#features)
  - [🧪 Testing](#-testing)
    - [Running Tests](#running-tests)
    - [⚠️ Important: E2E Testing Requirements](#️-important-e2e-testing-requirements)
  - [🔄 Git Workflow](#-git-workflow)
    - [Commit Message Convention](#commit-message-convention)
    - [Hooks](#hooks)
    - [Branch Naming](#branch-naming)
    - [Standard Workflow](#standard-workflow)
## ✨ Features

- 🔐 **Authentication & Authorization** - JWT-based auth with Google OAuth integration and 2FA (TOTP)
- 👥 **Role-Based Access Control** - Flexible permission system with customizable roles
- 🛒 **Product Management** - Categories, brands, SKUs with multi-language support
- 📦 **Order Processing** - Complete order lifecycle management
- 🛍️ **Shopping Cart** - Persistent cart functionality
- 💬 **Real-time Communication** - Socket.io for live notifications and messaging
- 🖼️ **Media Management** - AWS S3 integration for file uploads
- 📧 **Email Notifications** - Automated email system with React Email and Resend
- 🌐 **Internationalization** - Multi-language support (i18n)
- 📊 **Admin Dashboard** - Comprehensive management tools
- 🐳 **Docker Support** - Containerized deployment with Docker Compose
- 📝 **API Documentation** - OpenAPI/Swagger and GraphQL

## 🛠 Tech Stack

### Frontend

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router v7
- **State Management**: Zustand
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Form Validation**: Zod

### Backend

- **Runtime**: Node.js 24.12.0
- **Framework**: NestJS 11 + TypeScript
- **Database**: PostgreSQL 17
- **ORM**: Prisma 7
- **Caching**: Redis with BullMQ for job queues
- **Authentication**: JWT with Google OAuth
- **Email**: React Email + Resend
- **File Storage**: AWS S3
- **Real-time**: Socket.io with Redis adapter
- **API Docs**: Swagger/OpenAPI + GraphQL
- **Logging**: Pino

### DevOps & Tools

- **Package Manager**: pnpm 10.27.0
- **Monorepo**: Turbo
- **Containerization**: Docker + Docker Compose
- **Database UI**: Adminer
- **Linting**: ESLint 9
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
- **Commit Convention**: Commitlint

## 🛠 System Requirements

- Node.js >= 24.12.0
- pnpm >= 10.27.0
- Git
- Docker (optional, for containerized deployment)

### Install pnpm

If you don't have pnpm installed, you can install it using one of the following methods:

**Using npm:**

```bash
npm install -g pnpm
```

For more installation options, visit [pnpm installation guide](https://pnpm.io/installation).

## 🚀 Project Installation

### 1. Clone repository

```bash
git clone <repository-url>
cd ecommerce
```

### 2. Install dependencies

The project uses pnpm workspaces. Simply run from the root directory:

```bash
pnpm install
```

This will install all dependencies for root, client, and server automatically.

## 🏃‍♂️ Running the Project

### Development mode

The project uses Turbo for monorepo management. Run both client and server simultaneously:

```bash
# From root directory - runs both client and server in parallel
pnpm dev
```

Or run them separately:

```bash
# Terminal 1 - Run server only
cd server
pnpm start:dev

# Terminal 2 - Run client only
cd client
pnpm start:dev
```

Server will run on `http://localhost:3000`
Client will run on `http://localhost:5173`

### First-time setup

On your first run, you need to set up the database:

```bash
cd server

# Generate Prisma client
pnpm exec prisma generate

# Run database migrations
pnpm exec prisma migrate dev

# Seed initial data (optional)
pnpm seed
```

### Production build

```bash
# Build all packages from root
pnpm build

# Or build individually
cd client
pnpm build
pnpm start:prod   # Preview production build

cd server
pnpm build
pnpm start:prod   # Start production server
```

## 📚 API Documentation

The server includes comprehensive API documentation using OpenAPI/Swagger and GraphQL.

### Accessing API Docs

1. **Start the server** (development or production)
2. **Swagger UI**: `http://localhost:3000/api/v1/swagger`
3. **GraphQL Playground**: `http://localhost:3000/api/v1/graphql`

The interactive Swagger UI allows you to:

- Browse all available endpoints
- View request/response schemas
- Test API calls directly in the browser
- Download the OpenAPI specification

## 📮 Testing with Postman

The project includes a Postman collection with pre-configured requests.

### Setup

1. **Import Collection**

   - Open Postman
   - Click **Import**
   - Select `postman/collections/NestCommerce.postman_collection.json`

2. **Import Environment**

   - Click **Import**
   - Select `postman/environments/NestCommerce.postman_environment.json`

3. **Configure Environment**
   - Select "NestCommerce" environment in Postman
   - Update variables if needed:
     - `host`: `http://localhost:3000`

### Features

The collection includes:

- All API endpoints organized by category
- Pre-configured authentication headers
- Example request bodies
- Environment variables for tokens
- Test scripts for automated assertions

## 🧪 Testing

### Running Tests

```bash
cd server

# Run unit tests
pnpm test

# Run unit tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:cov

# Run e2e tests
pnpm test:e2e
```

### ⚠️ Important: E2E Testing Requirements

Before running e2e tests (`pnpm test:e2e`), you need to downgrade `uuid` and `chalk` packages due to ESM compatibility issues with Jest:

```bash
cd server
pnpm add uuid@9 chalk@4
```

After testing, you can restore the latest versions:

```bash
pnpm add uuid@latest chalk@latest
```

## 🔄 Git Workflow

### Commit Message Convention

The project uses [Conventional Commits](https://www.conventionalcommits.org/):

```bash
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `style`: Formatting changes that don't affect code logic
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding or fixing tests
- `chore`: Build tasks, package manager configs, etc.

**Examples:**

```bash
git commit -m "feat(auth): add user login functionality"
git commit -m "fix(api): resolve user data fetching issue"
git commit -m "docs: update installation guide"
git commit -m "style(client): format code with prettier"
```

### Hooks

The project has built-in git hooks to ensure code quality:

- **pre-commit**: Run lint and format code
- **commit-msg**: Check commit message format

### Branch Naming

- `main`: Production branch
- `feature/feature-name`: For new features
- `bugfix/bug-description`: For bug fixes
- `hotfix/issue-description`: For urgent production issues

### Standard Workflow

1. **Create a new branch**
   Always branch off from the latest version of `main`.

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Work on your feature**
   Make your code changes and commit them using the [Conventional Commits](https://www.conventionalcommits.org/) format:

   ```bash
   git add .
   git commit -m "feat(auth): add login functionality"
   ```

3. **Rebase with the latest main branch**
   Before pushing, make sure your branch is up to date with `main`:

   ```bash
   git fetch origin
   git rebase origin/main
   ```

4. **Push your branch to remote**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request (PR)**
   Open a PR to merge your branch into `main` using the project’s PR template.
   Wait for review and approval before merging.

6. **After Merge — Sync and Clean Up**
   Once your PR is merged:

   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/your-feature-name     # delete local branch
   git push origin --delete feature/your-feature-name   # delete remote branch
   ```
