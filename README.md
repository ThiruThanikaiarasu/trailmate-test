# TrailMate

Plan hiking trips with friends: day-by-day itineraries with distance and elevation, a shared gear
checklist, an even cost split, and read-only links you can send to people who are not on the trip.

```
apps/api         Express + TypeScript REST API, SQLite via better-sqlite3, Zod validation (Jest + supertest)
apps/web         React 18 + Vite + TanStack Query (Vitest + Testing Library)
packages/shared  Types and date / geo / unit / money helpers used by both apps (Vitest)
```

## Getting started

Requires Node.js 22 (see `.nvmrc`).

```bash
npm ci
npm run seed        # optional: creates trailmate.db with a sample trip
npm run dev:api     # http://localhost:4000/api
npm run dev:web     # http://localhost:5173 (proxies /api to the API)
```
