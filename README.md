# File Vault

File Vault is a personal file hosting service with per-user upload, download, and delete. It uses a React 19 SPA frontend, an Express 5 + TypeScript API backend, MongoDB for metadata, and local disk for file storage.

## Stack
- Node.js 22
- Express 5
- TypeScript
- MongoDB + Mongoose
- express-session + connect-mongo
- bcrypt
- multer
- React 19
- Vite
- Tailwind CSS 4

## Project Structure
- `server/` - API, auth, file routes, database models, and upload handling
- `client/` - SPA, auth state, dashboard, upload UI, and file tiles
- `server/uploads/` - local blob storage for uploaded files

## Local Development
```bash
# 1. Copy env template and fill in SESSION_SECRET
cp .env.example .env

# 2. Install workspace dependencies
pnpm install

# 3. Rebuild bcrypt if needed after a Node upgrade
pnpm --filter file-vault-server rebuild bcrypt

# 4. Start the API server
pnpm dev:server

# 5. Start the client
pnpm dev:client
```

## Build
```bash
pnpm build
```

## Highlights
- Per-user file management with upload, download, and delete
- Session-based authentication backed by MongoDB
- UUID-prefixed file storage with filename sanitization
- Local disk storage with a clear swap point for cloud storage later
- React dashboard with drag-and-drop upload and file cards
