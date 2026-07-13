---
name: Google OAuth auth
description: Clerk replaced with Passport.js + Google OAuth + express-session; architecture, routing, and gotchas for this monorepo.
---

# Google OAuth Auth (replaces Clerk)

Clerk has been fully removed. Auth is now Passport.js + `passport-google-oauth20` + `express-session` + `connect-pg-simple`.

## Architecture

- **Backend** (`artifacts/api-server/src/auth.ts`): canonical implementation; `setupAuth(app)` is `async` and called with `await` in `app.ts` before route registration. Routes: `/auth/google` (login), `/auth/google/callback` (OAuth callback), `/api/auth/google` + `/api/auth/google/callback` (aliases), `/api/auth/user` (session check), `/api/auth/logout` (POST).
- **Storage** (`artifacts/api-server/src/lib/storage.ts`): Drizzle-based user/visit CRUD. Methods: `getUserById`, `getUserByGoogleId`, `getUserByEmail`, `createUserWithGoogle`, `updateUserGoogle`, `recordVisit`, `getVisits`, `getVisitTimestampsSince`.
- **DB schema** (`lib/db/src/schema/auth.ts`): `usersTable` (id, username, googleId, email, displayName, createdAt) + `visitsTable` (id, userId, email, visitedAt). Sessions stored in `user_sessions` — created via inline SQL at boot (see gotcha below).
- **Frontend** (`artifacts/qr-course/src/auth.tsx`): single file containing `AuthUser` type, `useAuth()` hook, `useLogout()` hook, `HomeRedirect` component, and `protectedComponent()` HOC. Both `App.tsx` and `Layout.tsx` import from `@/auth`.

## Critical gotcha — connect-pg-simple + esbuild bundle

**Do NOT use `createTableIfMissing: true`** in the PgSession constructor. esbuild bundles everything into `dist/index.mjs`, and `connect-pg-simple` resolves `table.sql` via `__dirname` — which in the bundle points at `dist/`, not the package directory. The session store fails silently, sessions are never saved, and login produces an infinite redirect loop (authenticate → callback → unauthenticated → login → loop).

**Fix:** `createTableIfMissing: false` plus an explicit `await pool.query(CREATE TABLE IF NOT EXISTS ...)` before the store is created. `setupAuth` must be `async` and called with `await` in `app.ts`.

## Routing gotcha — /auth must be proxied to API server

The OAuth callback is at `/auth/google/callback` (not `/api/...`). The API server's `artifact.toml` `paths` must include both `/api` AND `/auth`:

```toml
[[services]]
paths = ["/api", "/auth"]
```

## Env vars required

- `GOOGLE_CLIENT_ID` (also reads `GOOGLE_LOGIN_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_ID`)
- `GOOGLE_CLIENT_SECRET` (also reads `GOOGLE_LOGIN_CLIENT_SECRET`, `GOOGLE_OAUTH_CLIENT_SECRET`)
- `SESSION_SECRET` — required in production; dev falls back to `basic-discrete-math-secret-key`
- `DATABASE_URL` — used by both Drizzle (course data) and the session pool (pg.Pool directly)

## Google Cloud Console — registered callback URIs

- Dev: `https://<REPLIT_DEV_DOMAIN>/auth/google/callback`
- Production: `https://baby-discrete-math.replit.app/auth/google/callback`

## Express 5 / TypeScript gotcha

`return next()` and `return res.json(...)` inside `RequestHandler` functions cause TS7030 in Express 5's strict types. Use `next(); return;` and `res.json(...); return;` (two statements) instead.

## Clerk integration warning

Replit's Clerk integration auto-reinjects `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY` as long as the integration remains connected. Disconnect it from Replit → Integrations panel, then delete the secrets manually. Any file referencing `CLERK_SECRET_KEY` (even dead code) will cause the scanner to keep the integration alive.
