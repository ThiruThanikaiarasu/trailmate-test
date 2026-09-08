# Notes for coding agents

This is an npm workspaces monorepo. Read README.md first.

## Commands

- Install: `npm ci`
- API tests (Jest): `npm run test:api` — one file: `npm run test:api -- <path>`
- Web and shared tests (Vitest): `npx vitest run` — one file: `npx vitest run <path>`
- Type check: `npm run typecheck`

Jest and Vitest are both installed. API code under `apps/api` is tested with **Jest only**;
`apps/web` and `packages/shared` with **Vitest only**. Test files import from `vitest` explicitly in
the Vitest packages; API tests use Jest globals.

## Conventions

- Shared and web tests are colocated: `foo.ts` → `foo.test.ts` in the same folder. Some older tests
  still live in `__tests__/` folders inside `src/`; that is fine, but don't add new ones elsewhere.
- API integration tests live in `apps/api/__tests__/` and use `createTestContext()` from
  `__tests__/helpers/testApp.ts`, which gives an in-memory database and a manual clock.
- Never read `Date.now()` or `new Date()` in API services — use the injected `Clock`.
- `packages/shared/src/generated/` is generated. Change the Zod schema in `apps/api/src/schemas`
  and run `npm run generate:types`; never edit the generated file by hand.
- API responses use camelCase field names. Database rows use snake_case; map them in the service
  layer.
- Money is integer cents everywhere.
- Keep changes focused; don't reformat unrelated files.

## Don't

- Don't commit `*.db` files or `.env`.
- Don't change `.github/workflows` without asking a maintainer.
