# File Hosting Service — Session Plan

> Read alongside `PROJECT_CONTEXT.md`. That doc is the audit. This doc is the mission.

---

## Before You Start — Two Hard Gates

**Gate 1 — Project name.**
This project needs a new name before any file is touched. Ask Kaushik what the new name is.
Update every reference: directory names, MongoDB database name, package name, README, and any title strings in the UI.

**Gate 2 — Frontend mockup.**
The current UI (Matrix-themed EJS + plain HTML) is being replaced with a React frontend. Do not write a single line of frontend code until Kaushik provides a mockup. The Matrix/hacker aesthetic is the right vibe — it just needs to look intentional and clean instead of rushed. What that actually looks like comes from his mockup, not from you.

---

## Session Goal

This app has a solid core idea: per-user file upload with UUID-prefixed storage, MongoDB metadata, and a download surface. The implementation is broken in about six ways and would embarrass anyone who opened the code. This session fixes every known issue, hardens the auth model, replaces the entire frontend with a proper React SPA, and leaves the codebase in a state that accurately represents what the author is capable of.

---

## Dependency Upgrade Targets

| Package | Current | Target |
|---|---|---|
| Node.js | unspecified | `22.x` LTS |
| Express | `4.18.2` | `5.x` latest stable |
| Mongoose | `7.0.1` | `8.x` latest stable |
| EJS | `3.1.8` | **Remove** — frontend moves to React |
| Multer | `1.4.5-lts.1` | Latest stable |
| uuid | `9.0.0` | `11.x` latest stable |
| body-parser | `1.20.2` | **Remove** — built into Express 5 |
| mongodb | `5.1.0` | **Remove** — unused, Mongoose handles the driver |
| nodemon | `2.0.21` | `3.x` latest stable (devDependency) |

**New dependencies to add:**
- `bcrypt` — password hashing
- `express-session` — session management
- `connect-mongo` — MongoDB-backed session store
- `multer-storage-cloudflare-r2` or `@aws-sdk/client-s3` if storage is moved (see note below)

---

## Architecture Changes

### Auth model — complete replacement

The current global `client` variable is not authentication. It is a race condition. Replace entirely:

- Add `express-session` with `connect-mongo` as the session store. Sessions are stored in MongoDB, not in process memory.
- On `/login`, look up the user, verify the hashed password, and call `req.session.user = { id, uname }`. Do not store the full Mongoose document in the session.
- Add an `isAuthenticated` middleware that checks `req.session.user` and returns `401` if missing. Apply it to `/home`, `/upload`, and every file download route.
- Add `POST /logout` that calls `req.session.destroy()`.

### File download route — replace startup registration

The current `fs.readdir` loop that registers one route per file at startup is broken by design — new uploads are never routable. Replace with a single parameterized route:

```
GET /files/:filename
```

This route checks `req.session.user`, looks up whether the requesting user owns that filename in MongoDB, and streams the file if authorized. One route. Works for all files including newly uploaded ones.

### Password hashing

`userData.pass` stores plaintext. Before any other auth work:

- Add `bcrypt` to the project.
- Hash passwords with `bcrypt.hash(password, 12)` on signup.
- Verify with `bcrypt.compare(plaintext, hash)` on login.
- The field can stay named `pass` in the schema — the name is not the problem.

### Environment variables

Everything hardcoded in `app.js` moves to environment variables:

- `MONGODB_URI` — replaces hardcoded `mongodb://127.0.0.1:27017/AppDevLab_50`
- `PORT` — replaces hardcoded `8000`
- `SESSION_SECRET` — required for `express-session`
- `MAX_FILE_SIZE_MB` — optional, defaults to a reasonable value

Add `.env.example` with all of these documented.

---

## File Storage Note

The current implementation stores uploaded blobs in a local `uploads/` directory. For a portfolio project, this is acceptable — local disk works. Do not add cloud storage (R2, S3) in this session unless Kaushik explicitly asks. Leave a comment in the Multer config noting that the `destination` function is the single swap point if cloud storage is added later.

---

## Security Fixes — All Blocking

1. **Plaintext passwords** — fixed by bcrypt (see above).
2. **Global session state** — fixed by express-session (see above).
3. **File auth is broken** — fixed by the parameterized download route (see above).
4. **MongoDB URI hardcoded** — fixed by env vars (see above).
5. **No null check on `/login`** — `detail` is not checked before `detail.pass` is accessed. Fix this as part of the auth rewrite.
6. **No null check on `/home`** — `client` is not checked. Fixed when `client` is replaced with `req.session.user` and `isAuthenticated` middleware.
7. **No null check on `/upload`** — `req.file` and session user are not checked. Add both guards.
8. **`uploads/` in the repo** — remove all checked-in fixture files from `uploads/`. Add `uploads/*` and `!uploads/.gitkeep` to `.gitignore`.

---

## Cleanup

- Delete `helper/fileUpload.js` entirely. It is dead prototype code.
- Delete or rewrite the `README.md` — it claims "secure user authentication" while storing plaintext passwords.
- Remove the dead `app.use("/public", express.static(..., "static"))` mount — the `static/` directory does not exist.
- Remove `body-parser` import everywhere (built into Express 5).
- Remove the direct `mongodb` import everywhere — Mongoose handles the driver.
- Add `package-lock.json` to version control (remove it from `.gitignore`).
- Add `uploads/` to `.gitignore`.

---

## Frontend Build Tasks (after mockup arrives)

- New frontend is a React SPA, served by Express from a `dist/` directory.
- The Matrix/hacker aesthetic is intentional — keep it. What Kaushik draws in the mockup defines the specifics.
- Screens needed at minimum: landing/login, signup, dashboard (file list + upload), file detail or download link.
- Use Tailwind CSS `4.x` for styling.
- Use React 19 + Vite 6 + TypeScript.
- The frontend communicates with the backend via fetch. API base URL comes from `VITE_API_BASE_URL` env var.
- All API responses should be JSON. Express no longer serves EJS templates.

---

## Done When

- [ ] `npm install` on a clean checkout installs all deps without errors.
- [ ] App starts with `node app.js` (or `npm start`) given a valid `.env`.
- [ ] Signup → login → upload → download flow works end to end.
- [ ] Newly uploaded files are downloadable without restarting the server.
- [ ] Passwords are hashed — raw strings are never stored in MongoDB.
- [ ] `/home`, `/upload`, and `/files/:filename` all return `401` when called without a valid session.
- [ ] No hardcoded URIs, ports, or paths anywhere in the source.
- [ ] `uploads/` directory is empty in the repo (gitkeep only).
- [ ] `helper/fileUpload.js` is gone.
- [ ] `.env.example` is complete and accurate.
- [ ] Frontend builds and the app serves it from `dist/`.