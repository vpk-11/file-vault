# PROJECT_CONTEXT

## One-Liner
File Vault is a personal file hosting service with per-user upload, download, and delete. React 19 SPA frontend, Express 5 + TypeScript API backend, MongoDB for metadata, local disk for blobs.

## Current State
- As of: 2026-06-18
- Confirmed: TypeScript compiles clean across both packages (`pnpm typecheck`)
- Confirmed: pnpm workspace monorepo with server/ and client/ packages
- Not confirmed: live end-to-end flow (requires MongoDB + .env configured)

---

## Architecture

### Monorepo Structure
```
/
  server/
    src/
      app.ts              Entry point: helmet, session, routes, mongoose connect
      config/env.ts       Validates required env vars on boot; exports typed constants
      middleware/
        auth.ts           isAuthenticated guard (checks req.session.user)
        errorHandler.ts   Global error handler, consistent JSON shape
      models/userData.ts  Mongoose model: users with embedded file metadata
      routes/
        auth.ts           POST /signup, POST /login, POST /logout, GET /me
        files.ts          GET /, POST /upload, GET /:filename, DELETE /:filename
      types/session.d.ts  Module augmentation: extends SessionData with user field
    uploads/              Local blob storage (gitignored except .gitkeep)
    tsconfig.json
    package.json
  client/
    src/
      context/AuthContext.tsx   Global auth state; checks /api/auth/me on load
      components/
        NavBar.tsx         Top bar: logo + user + logout
        UploadZone.tsx     Drag-and-drop upload with click fallback
        FileCard.tsx       File tile: icon, name, size, date, download, delete
      pages/
        AuthPage.tsx       Login/signup tab switcher
        DashboardPage.tsx  File manager: upload zone + grid + empty state + skeletons
      lib/
        api.ts             Typed fetch wrapper for all API endpoints
        fileUtils.ts       formatBytes, formatDate, fileIcon (by MIME type)
      index.css            Tailwind 4 + CSS custom property token system (dark theme)
    vite.config.ts         /api proxied to server:8000 in dev
    tsconfig.json
    package.json
```

### Data Model
`userData` collection:
```typescript
{
  uname: String           // unique, trimmed
  pass: String            // bcrypt hash, rounds=12
  age: Number
  email: String           // unique, lowercase, trimmed
  files: [{
    storedName: String    // UUID-prefixed, sanitized; actual on-disk filename
    originalName: String  // user-visible name
    size: Number          // bytes
    mimeType: String      // from multer
    uploadedAt: Date
  }]
  createdAt: Date         // timestamps: true
  updatedAt: Date
}
```

### API Surface
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/signup | No | Create account; rate-limited 20/15 min |
| POST | /api/auth/login | No | Login, set session; rate-limited 20/15 min |
| POST | /api/auth/logout | Yes | Destroy session, clear cookie |
| GET | /api/auth/me | Yes | Return session user |
| GET | /api/files | Yes | List user's files |
| POST | /api/files/upload | Yes | Upload file (multipart, field: avatar) |
| GET | /api/files/:filename | Yes | Stream file (ownership-checked) |
| DELETE | /api/files/:filename | Yes | Delete file from disk + metadata |

---

## Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 22.x |
| Server | Express | 5.x |
| Language | TypeScript | 5.x (server), 6.x (client) |
| Database | MongoDB + Mongoose | 8.x |
| Session | express-session + connect-mongo | 1.x + 5.x |
| Password | bcrypt | 5.x |
| Upload | multer | 2.x |
| Security headers | helmet | 8.x |
| Rate limiting | express-rate-limit | 7.x |
| Frontend | React | 19.x |
| Bundler | Vite | 8.x |
| Styling | Tailwind CSS | 4.x |
| Routing | React Router | 7.x |
| Package manager | pnpm workspaces | 10.x |

---

## Security: What Is In Place
- **Passwords**: bcrypt, 12 rounds. Never stored plaintext.
- **Session**: MongoDB-backed session store. httpOnly, sameSite: lax, secure in production.
- **Auth guard**: isAuthenticated middleware on every protected route.
- **Path traversal**: filename allowlist regex (`/^[A-Za-z0-9._-]+$/`) + path.resolve boundary check before serving or deleting.
- **Filename sanitization**: path.basename + non-allowlist char replacement at upload time.
- **Headers**: helmet — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc.
- **Rate limiting**: 20 requests / 15 min on /signup and /login via express-rate-limit.
- **Input validation**: required field checks, email regex, password min-length 8 on signup.
- **Error shape**: consistent `{ error: { code, message } }` — no stack traces to clients.

---

## Known Gaps and Loopholes

### Security Gaps (blocking for production use)

1. **No CSRF protection.**
   Session cookies with `sameSite: lax` reduce risk for same-site navigation but do not fully protect multipart uploads. A CSRF token or double-submit cookie pattern is missing.
   Risk: medium. A malicious page could trigger a file upload from an authenticated user's browser.

2. **No CORS configuration.**
   Express does not restrict allowed origins. In production, especially if the SPA is on a different domain, cross-origin requests will be unrestricted.
   Fix: add `cors` middleware with an explicit `origin` allowlist.

3. **No file type allowlist or blocklist.**
   Any file type is accepted. Malicious scripts (.sh, .bat, .js) can be uploaded and downloaded. The server does not execute them, but a phishing vector exists.
   Fix: define an allowlist of accepted MIME types, or at minimum block executable types.

4. **No file content scanning.**
   No antivirus or malware check on upload. Files are stored and served as-is.

5. **cookie.secure is off in development.**
   Correct for local dev. Must be `true` in production (NODE_ENV=production handles this). Deployer must set NODE_ENV correctly.

6. **No account deletion.**
   Users cannot delete their accounts or purge all their files. Data accumulates indefinitely.

7. **No session invalidation on logout from other devices.**
   Logout destroys the current session only. Other active sessions remain valid.

8. **Email is stored but not verified.**
   Signup accepts any string matching the regex. No confirmation email sent.

### Reliability Gaps

1. **No per-user storage quota.**
   A single user can fill the disk. MAX_FILE_SIZE_MB limits per-upload size, not cumulative storage.

2. **Non-atomic upload transaction.**
   Multer writes the file to disk, then Mongoose updates the metadata. If the DB write fails, the file is orphaned on disk with no metadata reference and no cleanup mechanism.
   Fix: write metadata first (reserved state), then write file, then mark confirmed. Or use a cron to clean orphaned files.

3. **No upload deduplication.**
   The same file uploaded twice creates two separate entries with different UUIDs.

4. **No pagination on GET /api/files.**
   Returns all files in a single response. Large file counts will cause slow queries and large payloads.

5. **Local disk storage is a single point of failure.**
   No backup, no replication. Disk failure = data loss. The Multer destination function is documented as the single swap point for cloud storage (S3, R2).

6. **No file metadata index.**
   `files` is an embedded array. Queries like `findOne({ _id, 'files.storedName': name })` do a full scan of the array for each document. Performance degrades with large file counts.
   Fix: add a sparse index on `files.storedName` or move files to a separate collection.

### Missing Features (for a complete Drive-like product)

1. **No search.** Files are browsable but not searchable by name.
2. **No folders.** Flat file list only.
3. **No file sharing.** Files are strictly private.
4. **No in-browser preview.** Images, PDFs, and text files download instead of previewing.
5. **No rename.** Files cannot be renamed after upload.
6. **No sort or filter.** Files appear in reverse upload order only.
7. **No upload progress.** UploadZone shows "Uploading..." text with no byte-level progress bar.
8. **No multi-file upload.** One file at a time only.
9. **Age field on signup.** Holdover from original prototype. Unusual for a file hosting service.

### Frontend Gaps

1. **No route-level auth guard.**
   DashboardPage checks auth inside useEffect and redirects, causing a render flash before redirect. A ProtectedRoute wrapper component would prevent this.

2. **No optimistic delete.**
   Card is removed only after server confirms. Should remove immediately and restore on failure.

3. **AuthContext calls /api/auth/me on every SPA mount.**
   Fine for this use case but adds a round-trip on every page load.

### Infrastructure Gaps

1. **No deployment config.** No Dockerfile, docker-compose, railway.toml, or Vercel config.
2. **No CI/CD.** No GitHub Actions for typecheck, lint, or build.
3. **No tests.** Auth, upload, download, and delete are all untested.
4. **No structured logging.** console.error throughout. No request IDs, no log levels, no pino/winston.
5. **No environment separation.** Single .env.example covers all environments.

---

## Local Dev

### Prerequisites
- Node.js 22.x
- pnpm 10.x
- MongoDB on 127.0.0.1:27017

### Setup
```bash
# 1. Copy env template and fill in SESSION_SECRET
cp .env.example .env

# 2. Install all workspace deps
pnpm install

# 3. If bcrypt native module is missing (first install or after node upgrade)
pnpm --filter file-vault-server rebuild bcrypt

# 4. Run server (tsx watch, hot-reload)
pnpm dev:server

# 5. Run client (Vite dev server at http://localhost:5173, proxies /api to :8000)
pnpm dev:client
```

### Build
```bash
pnpm build
# server/dist/   compiled JS, run with: node server/dist/app.js
# client/dist/   Vite bundle, serve statically or from Express
```

---

## Resume / Portfolio Highlights
- TypeScript monorepo: React 19 + Vite 8 SPA + Express 5 API in pnpm workspaces
- Session-based auth: bcrypt (12 rounds) + MongoDB-backed session store
- Parameterized file routes with ownership verification and path traversal protection
- helmet + rate limiting + cookie security flags
- Tailwind CSS 4 with CSS custom property token system (dark, Google Drive-like layout)
- Drag-and-drop upload, loading skeletons, empty states, delete with confirmation
- multer 2.x with UUID-prefix storage and filename sanitization at upload time
