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

API configuration is read from the environment:

| Variable          | Default                 | Meaning                                  |
| ----------------- | ----------------------- | ---------------------------------------- |
| `PORT`            | `4000`                  | API port                                 |
| `DATABASE_FILE`   | `trailmate.db`          | SQLite file (`:memory:` for a throwaway) |
| `PUBLIC_BASE_URL` | `http://localhost:5173` | Base of the links in share URLs          |
| `SHARE_TTL_HOURS` | `72`                    | Default lifetime of a share link         |

## Tests

| What                     | Command                                           |
| ------------------------ | ------------------------------------------------- |
| Everything               | `npm test`                                        |
| API (Jest)               | `npm run test:api`                                |
| One API test file        | `npm run test:api -- apps/api/__tests__/trips.test.ts` |
| Web + shared (Vitest)    | `npm run test:unit`                               |
| One Vitest file          | `npx vitest run packages/shared/src/geo/haversine.test.ts` |
| Type check all packages  | `npm run typecheck`                               |

The API is tested with Jest; the web app and the shared package with Vitest. Don't run API tests
through Vitest or the other way round.

## Generated API types

`packages/shared/src/generated/api-types.ts` is generated from the Zod schemas in
`apps/api/src/schemas`. After changing a schema, run:

```bash
npm run generate:types
```

and commit the result. CI and `apps/api/__tests__/apiTypes.test.ts` fail if the file is stale.

## How things work

### Units and locales

The web app is available in English and German. English uses miles and feet with US number
formatting; German uses kilometres and metres with a decimal comma. Dates follow the locale
(`Jul 3, 2026` / `03.07.2026`). All calendar dates are handled as UTC dates, so a trip day never
shifts with the viewer's time zone.

### Cost split

Every expense is split evenly between everyone on the trip, in whole cents. When the total does not
divide evenly, the trip owner covers the leftover cents, so the shares always add up to the total.
The balance column is what someone paid minus what they owe.

### Share links

`POST /api/trips/:id/share` creates a read-only link that expires after `SHARE_TTL_HOURS` (at most
30 days). A shared trip page shows the itinerary only — name, dates, days, waypoints, distances.
Participants, the gear checklist and costs are private to the group and are deliberately left out
of shared pages. Expired links answer `410 Gone`.

### Day numbering

Days are numbered 1..n per trip and their dates are derived from the trip's start date. Deleting a
day renumbers the following days.

## API overview

| Method | Path                                   |                                   |
| ------ | -------------------------------------- | --------------------------------- |
| GET    | `/api/trips`                           | list trips                        |
| POST   | `/api/trips`                           | create a trip (+ owner)           |
| GET    | `/api/trips/:id`                       | trip with counts and distance     |
| PATCH  | `/api/trips/:id`                       | update a trip                     |
| DELETE | `/api/trips/:id`                       | delete a trip                     |
| GET    | `/api/trips/:id/days`                  | itinerary                         |
| POST   | `/api/trips/:id/days`                  | add a day                         |
| POST   | `/api/days/:dayId/waypoints`           | add a waypoint                    |
| GET    | `/api/trips/:id/gear`                  | gear checklist                    |
| PATCH  | `/api/gear/:gearId`                    | rename, change quantity, pack     |
| GET    | `/api/trips/:id/participants`          | participants                      |
| POST   | `/api/trips/:id/expenses`              | record an expense                 |
| GET    | `/api/trips/:id/cost-split`            | who owes what                     |
| POST   | `/api/trips/:id/share`                 | create a share link               |
| GET    | `/api/share/:token`                    | shared (read-only) trip           |

Errors always use `{ "error": { "code", "message", "details"? } }`.
