# FlowSpace — Personal Mental Operating System

> A personal command center for creative technologists

## Features

- **Dashboard** — Energy input, active projects, smart task suggestions, AI alerts
- **Projects** — Full project management with progress auto-calculation
- **Tasks** — Smart task system with energy-based recommendations
- **Inner Council** — 5-perspective reflection tool for hard decisions
- **Mood & Focus Tracker** — Daily logging with weekly/monthly charts
- **Brain Dump Vault** — Quick idea capture with tag search and conversion
- **Offline Mode** — Full functionality without internet via Zustand localStorage

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/WambiruL/flowspace.git
cd flowspace
npm install
```

### 2. Environment Variables

```bash
cp .env
```

Edit `.env` with your Supabase credentials (or leave blank to use demo/offline mode).

### 3. Set Up Supabase (Optional)

1. Create project at https://supabase.com
2. Go to **SQL Editor** and paste contents of `schema.sql`
3. Copy your **Project URL** and **anon key** into `.env`

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Demo Mode (No Setup Required)

Click **"Continue with Demo (Offline)"** on the auth page. All data is stored in your browser's localStorage. No account needed.

---

## Task Recommendation Logic

The AI suggestion engine (`lib/ai-engine.ts`) scores tasks using a weighted algorithm:

| Factor | Rule | Score Impact |
|--------|------|-------------|
| **Priority** | High / Medium / Low | +30 / +20 / +10 |
| **Overdue** | Past due date | +35 |
| **Due today** | Due date = today | +25 |
| **Due this week** | Due within 7 days | +15 |
| **Energy match (low)** | Energy ≤2, task cost ≤2 | +20 |
| **Energy mismatch** | Energy ≤2, task cost ≥4 | −20 |
| **Energy match (high)** | Energy ≥4, high priority | +15 extra |
| **Balanced** | Energy = task cost ±1 | +10 |

Tasks are ranked by total score. The top 5 are shown as suggestions.

**System Alerts:**
- **Overload** — More than 5 high-priority incomplete tasks
- **Reflect** — Mood logged ≤2 for 3+ consecutive days
- **Energy mismatch** — Detected and shown inline

---

## Project Structure

```
flowspace/
├── app/
│   ├── auth/page.tsx           # Login/signup
│   ├── dashboard/page.tsx      # Main dashboard
│   ├── projects/page.tsx       # Project management
│   ├── tasks/page.tsx          # Task system
│   ├── reflections/page.tsx    # Inner Council
│   ├── tracker/page.tsx        # Mood & Focus
│   ├── vault/page.tsx          # Brain Dump
│   └── globals.css
├── components/
│   ├── QuickAddModal.tsx       # Universal quick-add
│   └── OnlineSync.tsx          # Network state handler
├── lib/
│   ├── ai-engine.ts            # Recommendation logic
│   ├── idb.ts                  # IndexedDB utilities
│   ├── supabase.ts             # Supabase client
│   └── utils.ts                # Helpers + constants
├── store/
│   └── index.ts                # Zustand store (persisted)
├── types/
│   └── index.ts                # TypeScript types
├── schema.sql                  # Supabase DB schema
└── .env

```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend/Auth | Supabase |
| State | Zustand (localStorage persisted) |
| Charts | Recharts |
| Offline | Zustand persistence + IndexedDB utilities |
| Icons | Lucide React |
