# Graph Report - file-hosting-service  (2026-06-18)

## Corpus Check
- 23 files · ~3,813 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 167 nodes · 166 edges · 19 communities (15 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8b9e2bb6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `compilerOptions` - 16 edges
3. `compilerOptions` - 11 edges
4. `scripts` - 6 edges
5. `scripts` - 5 edges
6. `scripts` - 5 edges
7. `api` - 3 edges
8. `isAuthenticated()` - 3 edges
9. `FileEntry` - 2 edges
10. `pnpm` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Human Readable Name` --shares_data_with--> `Human Readable Name`  [EXTRACTED]
  uploads/3d1e4205-8c1a-4ec4-af67-2db5729828a8-hello.txt → uploads/8c366a01-11ad-4e33-bde1-6792e250a4e7-hello.txt

## Import Cycles
- None detected.

## Communities (19 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.18
Nodes (10): name, pnpm, onlyBuiltDependencies, private, scripts, build, dev:client, dev:server (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+10 more)

### Community 2 - "Community 2"
Cohesion: 0.16
Nodes (13): MAX_FILE_SIZE_MB, MONGODB_URI, PORT, required, SESSION_SECRET, isAuthenticated(), AppError, errorHandler() (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (14): dependencies, react, react-dom, react-router-dom, name, private, scripts, build (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.33
Nodes (5): fileEntrySchema, IFileEntry, IUser, mongoose, userSchema

### Community 8 - "Community 8"
Cohesion: 0.14
Nodes (13): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, outDir, resolveJsonModule, rootDir (+5 more)

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/node, @types/react (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (3): api, AuthUser, FileEntry

### Community 11 - "Community 11"
Cohesion: 0.20
Nodes (9): description, main, name, scripts, build, dev, start, typecheck (+1 more)

### Community 12 - "Community 12"
Cohesion: 0.22
Nodes (9): dependencies, bcrypt, connect-mongo, dotenv, express, express-session, mongoose, multer (+1 more)

### Community 13 - "Community 13"
Cohesion: 0.22
Nodes (9): devDependencies, nodemon, tsx, @types/bcrypt, @types/express, @types/express-session, @types/multer, @types/node (+1 more)

## Knowledge Gaps
- **120 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+115 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 9` to `Community 4`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 12` to `Community 11`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 13` to `Community 11`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._