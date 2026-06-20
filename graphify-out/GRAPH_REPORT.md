# Graph Report - file-hosting-service  (2026-06-19)

## Corpus Check
- 28 files · ~5,395 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 192 nodes · 224 edges · 17 communities (13 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ad021911`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `compilerOptions` - 16 edges
3. `compilerOptions` - 11 edges
4. `useAuth()` - 7 edges
5. `api` - 7 edges
6. `scripts` - 6 edges
7. `FileEntry` - 6 edges
8. `formatBytes()` - 5 edges
9. `scripts` - 5 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `FileCardProps` --references--> `FileEntry`  [EXTRACTED]
  client/src/components/FileCard.tsx → client/src/lib/api.ts
- `NavBar()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/components/NavBar.tsx → client/src/context/AuthContext.tsx
- `UploadZoneProps` --references--> `FileEntry`  [EXTRACTED]
  client/src/components/UploadZone.tsx → client/src/lib/api.ts
- `AuthPage()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/pages/AuthPage.tsx → client/src/context/AuthContext.tsx
- `FileCard()` --calls--> `fileIcon()`  [EXTRACTED]
  client/src/components/FileCard.tsx → client/src/lib/fileUtils.ts

## Import Cycles
- None detected.

## Communities (17 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.18
Nodes (10): name, pnpm, onlyBuiltDependencies, private, scripts, build, dev:client, dev:server (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+10 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (19): MAX_FILE_SIZE_MB, MONGODB_URI, PORT, required, SESSION_SECRET, isAuthenticated(), AppError, errorHandler() (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (14): dependencies, react, react-dom, react-router-dom, name, private, scripts, build (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, outDir, resolveJsonModule, rootDir (+5 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (15): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, tailwindcss, @tailwindcss/vite (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (17): FileCard(), FileCardProps, NavBar(), UploadZoneProps, AuthContext, AuthContextType, AuthProvider(), useAuth() (+9 more)

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (19): description, devDependencies, nodemon, tsx, @types/bcrypt, @types/express, @types/express-rate-limit, @types/express-session (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (11): dependencies, bcrypt, connect-mongo, dotenv, express, express-rate-limit, express-session, helmet (+3 more)

## Knowledge Gaps
- **127 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+122 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 9` to `Community 4`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 12` to `Community 11`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _127 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._