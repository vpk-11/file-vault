# PROJECT_CONTEXT

## One-Liner
Single-process Node/Express file-hosting prototype with MongoDB-backed user records and Multer-based local disk uploads. It presents a Matrix-themed sign-up/login UI, then stores per-user uploaded filenames in MongoDB and the blobs in `uploads/`.

## Current State
- As of: 2026-06-17
- Confirmed in this audit: `node --check app.js` and `node --check helper/fileUpload.js` both pass, so the JavaScript parses cleanly.
- Confirmed in code: `app.js` starts an Express server on port `8000` only after `mongoose.connect("mongodb://127.0.0.1:27017/AppDevLab_50")` succeeds.
- Confirmed in code: `/` serves `public/home.html`, `/signup` creates `userData` documents, `/login` loads one document by `uname`, `/upload` writes files into `uploads/`, and `/home` renders `views/sophie.ejs`.
- Not confirmed here: live MongoDB startup, login round-trip, upload round-trip, and file download round-trip.
- Broken or incomplete:
  - `client` is a module-global auth state in `app.js`, so the last login wins across all requests and users.
  - `/home` renders `client.uname` and `client.files` with no null guard; a direct visit before login is likely to throw.
  - `/login` dereferences `detail.pass` without checking for `detail === null`.
  - `/upload` assumes `req.file` and `client` both exist.
  - File download routes are registered once at startup from the current contents of `uploads/`; files uploaded later will not get a `/file-...` route until restart.
  - The authorization check in the dynamic file route is wrong: `userModel.find({ files: file })` returns an array, but the code reads `detail.uname`.
  - `helper/fileUpload.js` is an orphaned prototype and is not imported anywhere.
- Mocked, hardcoded, or placeholder:
  - MongoDB URI and port are hardcoded in `app.js`.
  - `README.md` claims “secure user authentication,” but passwords are stored and compared in plaintext.
  - `public/home.html` and `views/sophie.ejs` are demo UI, not production UX.
- Overall readiness: local only.

## Core Stack

### Frontend
- Server-rendered HTML with EJS in `views/sophie.ejs`.
- Static landing page in `public/home.html`.
- CSS in `public/styles.css`.
- No client framework, bundler, or component system.

### Backend
- Node.js application entry point: `app.js`.
- Express `4.18.2`.
- EJS `3.1.8`.
- Mongoose `7.0.1` with a MongoDB database at `AppDevLab_50`.
- Multer `1.4.5-lts.1` for multipart upload handling.
- `body-parser` `1.20.2`, though `express.json()` is also used.
- `uuid` `9.0.0` for upload filename prefixing.
- `mongodb` `5.1.0` is listed but not used directly in the code.

### AI / LLM Layer
- None.

### Database & Storage
- MongoDB database: `AppDevLab_50` on `mongodb://127.0.0.1:27017`.
- Mongoose model: `userData` in `userData.js`.
- Local filesystem storage: `uploads/`.
- Checked-in sample uploads exist in `uploads/` and are part of the repo state.

### External APIs & Integrations
- None beyond local MongoDB.

### Dev Tooling
- `nodemon` `2.0.21` is present in `devDependencies`.
- No lint config.
- No test framework.
- No build tool.
- `npm test` is a placeholder that exits `1`.

### Deployment Config
- None present.
- No `Dockerfile`, `docker-compose`, `vercel.json`, `railway.toml`, `wrangler.toml`, or similar.

## Architecture Summary
- Overall shape: single-process monolith.
- Key files:
  - `app.js`: Express bootstrap, Mongo connection, auth routes, upload handling, static file serving, and startup-time registration of `/file-${file}` routes for existing upload files.
  - `userData.js`: Mongoose schema/model for user records.
  - `public/home.html`: landing page with sign-up and login forms.
  - `views/sophie.ejs`: logged-in upload page and file listing.
  - `public/styles.css`: landing page styling.
  - `helper/fileUpload.js`: older standalone upload experiment; not imported by `app.js`.
- Data model:
  - `userData`: `{ uname: String, pass: String, age: Number, email: String, files: [String] }`.
  - `files` stores stored filenames, not original filenames.
  - No schema validation, uniqueness constraint, timestamps, or indexes.
- Notable patterns:
  - Server-rendered UI with filesystem-backed blobs and MongoDB metadata.
  - UUID-prefixed upload naming via Multer `diskStorage`.
  - Ad hoc authorization through per-file routes, but the implementation is currently flawed.

## Runtime Flow
1. Landing page
   - `GET /` in `app.js` sends `public/home.html`.
   - `public/home.html` posts to `/signup` and `/login`.
2. Sign-up and login
   - `POST /signup` reads `uname`, `pswd`, `age`, and `email` from `req.body`, calls `userModel.find({ uname })`, and inserts a new `userData` document when no match exists.
   - `POST /login` calls `userModel.findOne({ uname: enteredUname })`, compares `detail.pass == enteredPass`, assigns the result to the module-global `client`, and redirects to `/home`.
   - There is no password hashing, session middleware, or logout path.
3. Upload and file access
   - `GET /home` renders `views/sophie.ejs` with `{ client }`.
   - `POST /upload` uses `upload.single("avatar")`, writes the file into `uploads/` with a UUID prefix, pushes the stored filename into `client.files`, saves the Mongo document, and redirects back to `/home`.
   - At startup, `fs.readdir("./uploads", ...)` registers one `GET /file-${file}` route per file already present in `uploads/`.
   - Those routes attempt to authorize by looking up `userModel.find({ files: file })`, but the code assumes a single document and the check is incorrect.

## API / Router Surface
### Public pages
- `GET /` -> serves `public/home.html` from `app.js`.
- `GET /home` -> renders `views/sophie.ejs` with `client`.

### Auth
- `POST /signup` -> implemented in `app.js`; creates a `userData` record if `uname` is unused.
- `POST /login` -> implemented in `app.js`; plaintext password compare against `userData.pass`.

### Uploads
- `POST /upload` -> implemented in `app.js`; Multer file upload and Mongo metadata update.
- `GET /file-${file}` -> dynamically registered in `app.js` for each file discovered in `uploads/` at process start.

### Orphaned prototype surface
- `helper/fileUpload.js` also defines:
  - `POST /upload`
  - `GET /file-${file}`
  - `app.listen(3000, ...)`
- That file is not imported by `app.js`, so those handlers are dead code unless someone runs the file directly after fixing the missing `app` declaration.

## Environment
### Required
- None are read from `process.env`.
- Operationally required: a reachable MongoDB instance at `mongodb://127.0.0.1:27017/AppDevLab_50`; if it is absent, `app.js` will not start.

### Optional
- None.
- All current runtime configuration is hardcoded in `app.js`.

## Key Decisions
- MongoDB is used only for user metadata; file contents live on local disk in `uploads/`.
- Uploaded blobs are renamed with `uuid()` prefixes to avoid filename collisions.
- Login state is stored in-process in `client` instead of sessions or JWTs.
- File access paths are derived from stored filenames rather than signed URLs or object storage keys.
- The app uses server-rendered EJS and static HTML instead of a client-side SPA.

## Local Dev
```bash
npm install
# start a local MongoDB instance that listens on 127.0.0.1:27017 first
node app.js
```

Dev server with auto-reload:
```bash
npx nodemon app.js
```

Test:
```bash
npm test
```
- This currently prints `Error: no test specified` and exits with status `1`.

Build:
```bash
# no build step exists
```

## Code Quality Flags
- Security:
  - Passwords are stored in plaintext in `userData.pass` and compared directly in `/login`.
  - No session, cookie, CSRF, or token-based auth exists.
  - `client` is global process state, so one user can overwrite another user’s session context.
  - File authorization is broken in the dynamic `/file-${file}` handler.
  - Uploaded filenames are exposed directly via predictable route patterns.
  - MongoDB connection string is hardcoded.
- Reliability:
  - `/login` can crash on unknown usernames because `detail` is not null-checked.
  - `/home` can crash if `client` is undefined.
  - `/upload` can crash if no file is sent or no user is logged in.
  - Startup-time `fs.readdir()` means newly uploaded files are not routable until restart.
  - The route handler for existing uploads uses `userModel.find()` but treats the result as a single document.
  - `helper/fileUpload.js` uses `app` without defining it and calls `storage.getFilename()`, which is not a valid Multer API.
- Dependency and maintenance risk:
  - No lockfile is committed; reproducible installs are not pinned.
  - `package-lock.json` is ignored in `.gitignore`.
  - `mongodb` is installed but unused in the code.
  - `body-parser` is redundant with the built-in Express JSON parser already used.
- Structural debt:
  - `helper/fileUpload.js` is dead prototype code.
  - `views/sophie.ejs` duplicates some layout/CSS inline instead of using `public/styles.css`.
  - `app.use("/public", express.static(path.join(__dirname, "static")));` points at a `static/` directory that does not exist in the tree.
  - `app.set('views')` is a no-op as written.
- Blocking TODOs/FIXMEs:
  - None are explicitly marked, but the auth/session/file-download issues above are blocking for real use.

## Resume / Portfolio Highlights
- The project demonstrates a full file-upload loop: HTML form -> Multer disk write -> MongoDB metadata update -> render of user-owned filenames.
- It uses UUID-prefixed stored filenames to avoid collisions and preserve uploads independently of the user’s original filename.
- The code shows direct integration across Express, EJS, Mongoose, and filesystem persistence without a framework scaffold.
- The domain is concrete rather than generic: a Matrix-themed personal file vault with per-user upload tracking.
- The architecture decisions are visible and easy to discuss in an interview, even though the implementation needs hardening.

## Gap Analysis
### Quick wins (< 1 day each)
- Add `npm start` and `npm run dev` scripts.
- Replace hardcoded MongoDB URI and port with environment variables.
- Add null checks in `/login`, `/home`, and `/upload`.
- Delete or quarantine `helper/fileUpload.js`.
- Stop checking sample/user uploads into `uploads/`.
- Remove the dead `/public -> static` mount or point it at the actual static directory.

### Medium lifts (1–3 days each)
- Replace the global `client` with `express-session` or another real session mechanism.
- Hash passwords with `bcrypt` or equivalent.
- Add a single download route with parameterized authorization instead of startup-generated routes.
- Add validation for username, email, age, and upload presence.
- Add a unique index on `uname` and handle duplicate-user races.
- Add tests for signup, login, upload, and file authorization.

### Major reworks (1+ week)
- Move blob storage out of the local filesystem into durable object storage or MongoDB GridFS.
- Split the monolith into routes/controllers/services with explicit auth middleware.
- Add proper deployment configuration, secret management, and observability.
- Replace the current ad hoc authorization model with a real access-control layer.

## Cleanup Notes
- `helper/fileUpload.js` is orphaned and contains stale commented-out code.
- `uploads/` contains checked-in fixture files, including binary image assets and text samples.
- `views/sophie.ejs` has inline CSS that duplicates the style system in `public/styles.css`.
- `README.md` oversells security relative to the actual plaintext-password implementation.
- `.gitignore` ignores `package-lock.json`, which makes installs less reproducible.
- `public/home.html` and `views/sophie.ejs` have Matrix-themed copy that looks like project-demo text rather than production content.
