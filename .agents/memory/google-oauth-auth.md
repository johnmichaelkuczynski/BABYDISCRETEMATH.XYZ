---
name: Google OAuth auth
description: Clerk replaced with Passport.js + Google OAuth + express-session; architecture, routing, and gotchas for this monorepo.
---

# Google OAuth Auth (replaces Clerk)

Clerk has been fully removed. Auth is now Passport.js + `passport-google-oauth20` + `express-session` + `connect-pg-simple`.

## Architecture

- **Backend** (`artifacts/api-server/src/auth.ts`): canonical implementation; `setupAuth(app)` called in `app.ts` before route registration. Routes: `/auth/google` (login), `/auth/google/callback` (OAuth callback), `/api/auth/google` + `/api/auth/google/callback` (aliases), `/api/auth/user` (session check), `/api/auth/logout` (POST).
- **Storage** (`artifacts/api-server/src/lib/storage.ts`): Drizzle-based user/visit CRUD. Methods: `getUserById`, `getUserByGoogleId`, `getUserByEmail`, `createUserWithGoogle`, `updateUserGoogle`, `recordVisit`, `getVisits`, `getVisitTimestampsSince`.
- **DB schema** (`lib/db/src/schema/auth.ts`): `usersTable` (id, username, googleId, email, displayName, createdAt) + `visitsTable` (id, userId, email, visitedAt). Sessions stored in `user_sessions` (auto-created by connect-pg-simple).
- **Frontend hook** (`artifacts/qr-course/src/hooks/useAuth.ts`): `useAuth()` calls `/api/auth/user`; `useLogout()` POSTs to `/api/auth/logout` and clears React Query cache + redirects to `/`.
- **Frontend App** (`artifacts/qr-course/src/App.tsx`): no Clerk; `protectedComponent` HOC and `HomeRedirect` both call `useAuth()` and return `null` while loading.
- **Layout** (`artifacts/qr-course/src/components/layout/Layout.tsx`): uses `useAuth()` for user display name/email and `useLogout()` for the Sign out button.

## Routing gotcha — /auth must be proxied to API server

The Replit proxy routes by path prefix. The callback is at `/auth/google/callback` (not `/api/...`). The API server's `artifact.toml` `paths` must include both `/api` AND `/auth`:

```toml
[[services]]
paths = ["/api", "/auth"]
```

Without `/auth`, the OAuth callback hits the frontend (which returns `index.html`), breaking the login flow.

## Env vars required

- `GOOGLE_CLIENT_ID` (or `GOOGLE_LOGIN_CLIENT_ID`) — Google Cloud OAuth client ID
- `GOOGLE_CLIENT_SECRET` (or `GOOGLE_LOGIN_CLIENT_SECRET`) — Google Cloud OAuth client secret
- `SESSION_SECRET` — required in production; falls back to a dev string in development
- `DATABASE_URL` — used by both Drizzle (course data) and the session pool (pg.Pool directly)

## Google Cloud Console setup (per environment)

Register these redirect URIs in the OAuth client:
- Dev: `https://<REPLIT_DEV_DOMAIN>/auth/google/callback`
- Production: `https://<REPLIT_DOMAINS>/auth/google/callback`

The server logs the exact callback URL at startup: `Google OAuth configured. Callback URL: ...`

## Express 5 / TypeScript gotcha

`RequestHandler` in `@types/express@5` is strict about return types. A callback that `return`s in one branch must also return consistently or TS7030 fires. Fix: use `res.status(N).json(...); return;` (two statements) instead of `return res.status(N).json(...)` in Express 5 handlers.

**Why:** `json()` returns `Response` (non-void); if one branch returns it and another doesn't, TS infers a mixed return type and flags TS7030.

## What was removed

- `@clerk/express`, `@clerk/shared` from api-server
- `@clerk/react`, `@clerk/themes` from qr-course
- `clerkProxyMiddleware` (no longer imported in app.ts; file kept but unused)
- Clerk env vars (`CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`) — can be deleted after confirming login works
- `@layer clerk` in `index.css` and `@import "@clerk/themes/shadcn.css"`
- `/sign-in` and `/sign-up` routes from wouter Router
