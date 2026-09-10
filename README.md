# 🏎️ FH6 Cars — Forza Horizon 6 Car Database, REST API & Web Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v24+-green.svg)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.19-blue.svg)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.17-indigo.svg)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org)

**FH6 Cars** is a production-ready, monorepo platform for maintaining and publicly exposing a structured database of **Forza Horizon 6 cars**.

---

## ⚡ Automated Database & Table Initialization

A standalone script is provided to automatically check, create the database, and create all tables/indexes if they do not exist:

```bash
# Initialize DB & Tables using DATABASE_URL from .env
pnpm db:init

# Initialize DB, Tables & Seed Initial Data in one command
pnpm db:setup

# Or initialize a custom database URL on demand:
pnpm db:init "postgresql://postgres:TestPassword123@localhost:5432/my_custom_fh6_db"
```

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
* Node.js (>= 18.0.0)
* pnpm (>= 8.0.0)
* Docker or PostgreSQL 16

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/fh6cars/fh6-cars.git
cd fh6-cars

pnpm install
```

### 3. Start Database & Run Setup
```bash
# Start PostgreSQL via Docker Compose
docker compose up -d

# Create Database, Tables & Seed Data
pnpm db:setup
```

### 4. Start Development Servers
```bash
pnpm dev
```

### Expected Endpoints:
* **Frontend Web App**: `http://localhost:5173`
* **REST API**: `http://localhost:5000/api/v1`
* **Swagger UI API Docs**: `http://localhost:5000/api/docs`
