# Graph Report - /Users/vpk11/Library/CloudStorage/OneDrive-Personal/Documents/Development/file-hosting-service  (2026-06-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 69 nodes · 70 edges · 9 communities (6 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ec95c32b`
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

## God Nodes (most connected - your core abstractions)
1. `scripts` - 4 edges
2. `isAuthenticated()` - 3 edges
3. `hooks` - 2 edges
4. `{ errorHandler }` - 2 edges
5. `errorHandler()` - 2 edges
6. `pnpm` - 2 edges
7. `PreToolUse` - 1 edges
8. `express` - 1 edges
9. `session` - 1 edges
10. `MongoStore` - 1 edges

## Surprising Connections (you probably didn't know these)
- `Human Readable Name` --shares_data_with--> `Human Readable Name`  [EXTRACTED]
  uploads/3d1e4205-8c1a-4ec4-af67-2db5729828a8-hello.txt → uploads/8c366a01-11ad-4e33-bde1-6792e250a4e7-hello.txt

## Import Cycles
- 1-file cycle: `app.js -> app.js`

## Communities (9 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (14): author, description, devDependencies, nodemon, license, main, name, pnpm (+6 more)

### Community 1 - "Community 1"
Cohesion: 0.15
Nodes (12): app, authRoutes, { errorHandler }, express, fileRoutes, mongoose, MongoStore, path (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.15
Nodes (12): { diskStorage, MulterError }, express, { isAuthenticated }, { MAX_FILE_SIZE_MB }, multer, path, router, storage (+4 more)

### Community 3 - "Community 3"
Cohesion: 0.22
Nodes (9): dependencies, bcrypt, connect-mongo, dotenv, express, express-session, mongoose, multer (+1 more)

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (6): isAuthenticated(), bcrypt, express, { isAuthenticated }, router, userModel

### Community 5 - "Community 5"
Cohesion: 0.50
Nodes (3): fileEntrySchema, mongoose, userSchema

## Knowledge Gaps
- **53 isolated node(s):** `PreToolUse`, `express`, `session`, `MongoStore`, `path` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **What connects `PreToolUse`, `express`, `session` to the rest of the system?**
  _53 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._