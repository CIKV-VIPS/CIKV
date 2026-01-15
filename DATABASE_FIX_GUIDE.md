# Deployment Guide: Fixing Database Connection Errors

## Problem
The application is showing `PrismaClientUnknownRequestError: Tenant or user not found` errors on Vercel. This indicates the PostgreSQL database connection is failing due to invalid credentials or misconfigured DATABASE_URL.

## Root Causes
1. **Missing or Invalid DATABASE_URL**: The environment variable is not set or contains incorrect credentials
2. **Neon Database Issue**: If using Neon, the project/branch credentials may be expired or incorrect
3. **Connection Pool Exhaustion**: Too many concurrent connections to the database

## Solutions Implemented in Code

### 1. Error Handling (✅ DONE)
- Created `src/lib/safe-prisma.ts` with safe wrapper functions for all database queries
- All queries now return empty arrays/null on database errors instead of crashing
- Error messages are logged but don't bubble up to users

### 2. Error Boundary (✅ DONE)
- Added `src/app/error.tsx` to gracefully handle component errors
- Added `src/app/loading.tsx` for loading states

### 3. Database Query Protection (✅ DONE)
- Updated all server components to use safe-prisma wrappers:
  - `/app/page.tsx` - Homepage
  - `/app/blogs/page.tsx` - All blogs
  - `/app/blogs/[id]/page.tsx` - Blog detail
  - `/app/events/[id]/page.tsx` - Event detail
  - `/app/gallery/page.tsx` - Gallery

## What You MUST Do on Vercel

### CRITICAL: Set Environment Variables
Go to your Vercel project dashboard and set the `DATABASE_URL` environment variable with the correct PostgreSQL connection string.

**Steps:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project "CIKV"
3. Go to **Settings** → **Environment Variables**
4. Add or update `DATABASE_URL` with your Neon database connection string:
   - Format: `postgresql://user:password@host/database`
   - Get this from your Neon dashboard

### Alternative: Contact Your Database Provider

#### **Neon (Recommended - Most Common)**
If your Neon credentials are expired or invalid:

**Option A: Create a New Branch (Easiest)**
1. Go to [Neon Console](https://console.neon.tech)
2. Select your CIKV project
3. Click **Branches** (left sidebar)
4. Click **Create branch**
5. Name it (e.g., `production-2025`)
6. Click the branch name to open it
7. Click **Connection string** button
8. Copy the full connection string (starts with `postgresql://`)
9. Go to [Vercel Dashboard](https://vercel.com) → CIKV project → Settings → Environment Variables
10. Update `DATABASE_URL` with the new connection string
11. Redeploy on Vercel

**Option B: Create a New Project (Clean Slate)**
1. Go to [Neon Console](https://console.neon.tech)
2. Click **New Project**
3. Enter project name (e.g., `cikv-prod`)
4. Select PostgreSQL version (15 or 16 recommended)
5. Click **Create Project**
6. Once created, go to **Connection string**
7. Copy the full connection string
8. On Vercel, update `DATABASE_URL` with this new string
9. Run migrations: `npx prisma migrate deploy` (after deployment)
10. Redeploy on Vercel

**Getting Your Connection String from Neon:**
1. Neon Console → Your Project → SQL Editor
2. Click **Connection Details** (right panel)
3. Select your database name (usually `neondb`)
4. Select **Connection string**
5. Copy the entire URL (format: `postgresql://user:password@host/database`)

#### **Self-hosted PostgreSQL**
Verify these details with your hosting provider:
- **Host**: Database server address (e.g., `db.example.com`)
- **Port**: Usually `5432`
- **Username**: Database user (e.g., `postgres`)
- **Password**: User password
- **Database**: Database name (e.g., `cikv_db`)

Connection string format: `postgresql://username:password@host:5432/database`

#### **Other Providers (PlanetScale, AWS RDS, etc.)**
- Check your provider's documentation for connection string format
- Usually found in: Dashboard → Databases → Connection Details
- Copy the connection string and set it as `DATABASE_URL` on Vercel

### Optional: Increase Connection Pool Limit
If using Neon, you may need to increase connection limits:
1. Neon Dashboard → Project Settings → Connection Pooling
2. Increase PgBouncer connection limit to at least 25

## Testing After Fix

1. **Clear Vercel Cache**: Go to Settings → Git → Clear Build Cache, then redeploy
2. **Monitor Logs**: Watch Vercel logs to ensure no more "Tenant or user not found" errors
3. **Test Endpoints**: 
   - Visit homepage - should show upcoming events or "No upcoming events"
   - Visit /blogs - should load or show "No blog posts published yet"
   - Visit /gallery - should load or show "No images"

## Fallback Behavior (No Database)
If DATABASE_URL remains unset, the app will still load with:
- Empty event lists
- Empty blog lists
- Empty galleries
- Users can still access all pages without errors

This is intentional to prevent 500 errors and allow partial functionality.
