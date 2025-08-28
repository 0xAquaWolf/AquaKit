# Repository Guidelines

## Project Structure & Module Organization
- `src/app/`: Next.js App Router routes (`page.tsx`, `layout.tsx`, API routes under `api/`).
- `src/components/`: App components; UI primitives in `src/components/ui/`, admin/debug in `src/components/admin` and `src/components/debug`.
- `src/lib/` and `src/hooks/`: Shared utilities and React hooks.
- `convex/`: Convex backend (auth, schema, http endpoints). Do not edit `convex/_generated/**`.
- `public/`: Static assets (images, icons). 
- `docs/` and `QUICK_ADMIN_SETUP.md`: Setup guides (OAuth, admin, deployment).

## Build, Test, and Development Commands
- `npm run dev`: Start Next.js (Turbopack) locally at `http://localhost:3000`.
- `npm run dev:backend`: Start Convex dev server with component type checks.
- `npm run dev:frontend`: Next.js dev over HTTPS (useful for OAuth callbacks).
- `npm run build`: Production build (Turbopack).
- `npm run start`: Run the production build.
- `npm run lint`: ESLint (flat config) over the repo.
- `npm run format` / `npm run format:check`: Prettier write/check.
- `npm run env:setup[:dev|:prod]`: Bootstrap env files; see `scripts/`.
- `npx convex env set KEY VALUE`: Manage Convex env vars.

## Coding Style & Naming Conventions
- TypeScript everywhere; strict, no `any` unless justified.
- Prettier: 2-space indent, 80 cols, single quotes, trailing commas.
- Import order: `react`, `next`, `@/*`, then relative; keep groups separated.
- Components: PascalCase filenames in `src/components/`; hooks in `src/hooks` as `useThing.ts`.
- Routes: App Router structure with folder names kebab-case; files `page.tsx`, `layout.tsx`.

## Testing Guidelines
- No formal test suite yet. Prefer small, testable units in `src/lib/` and pure helpers.
- For UI, rely on story-like usage in `src/components/ui/` and manual verification.
- If adding tests, propose Vitest + React Testing Library, and Playwright for e2e in CI.

## Commit & Pull Request Guidelines
- Commits: short imperative subject, present tense; add a descriptive body when changing behavior.
  - Example: `Add OAuth provider linking to admin dashboard`.
- PRs: clear description, link issues, include screenshots for UI, list env/DB migrations, and test steps.
- Keep changes scoped; update docs under `docs/` when relevant (e.g., OAuth, admin, deployment).

## Security & Configuration Tips
- Never commit secrets. Use `.env.local` and Convex env (`npx convex env set`).
- Start with `README.md` and `docs/` for provider setup; run `node scripts/setup-admin.js` to grant admin.
