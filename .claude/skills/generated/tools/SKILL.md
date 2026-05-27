---
name: tools
description: "Skill for the Tools area of tiny-world-builder. 25 symbols across 4 files."
---

# Tools

25 symbols | 4 files | Cohesion: 66%

## When to Use

- Working with code in `tools/`
- Understanding how send, redirect, numberInRange work
- Modifying tools-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `tools/dev-server.js` | send, redirect, numberInRange, readAiLog, routeForRequest (+11) |
| `tools/cluso-webhook.js` | readLog, appendEvent, send, server |
| `tools/smoke-static.js` | fail, requireIncludes, requireNotIncludes |
| `tools/check.js` | fail, settingsPanelBody |

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `send` | Function | `tools/dev-server.js` | 48 |
| `redirect` | Function | `tools/dev-server.js` | 59 |
| `numberInRange` | Function | `tools/dev-server.js` | 92 |
| `readAiLog` | Function | `tools/dev-server.js` | 148 |
| `routeForRequest` | Function | `tools/dev-server.js` | 520 |
| `server` | Function | `tools/dev-server.js` | 533 |
| `choose` | Function | `tools/dev-server.js` | 88 |
| `voxelPartsSchema` | Function | `tools/dev-server.js` | 156 |
| `extractJsonText` | Function | `tools/dev-server.js` | 199 |
| `parseModelJson` | Function | `tools/dev-server.js` | 211 |
| `handleReinterpretStamp` | Function | `tools/dev-server.js` | 266 |
| `createLogId` | Function | `tools/dev-server.js` | 98 |
| `sanitizeForLog` | Function | `tools/dev-server.js` | 102 |
| `appendAiLog` | Function | `tools/dev-server.js` | 132 |
| `voxelBuildSchema` | Function | `tools/dev-server.js` | 377 |
| `handleEnhanceVoxelBuild` | Function | `tools/dev-server.js` | 404 |
| `readLog` | Function | `tools/cluso-webhook.js` | 27 |
| `appendEvent` | Function | `tools/cluso-webhook.js` | 38 |
| `send` | Function | `tools/cluso-webhook.js` | 42 |
| `server` | Function | `tools/cluso-webhook.js` | 47 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Server → Tt` | cross_community | 5 |
| `Server → CreateLogId` | cross_community | 4 |
| `Server → SanitizeForLog` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Cluso | 4 calls |
| Examples | 2 calls |
| Scratch | 1 calls |

## How to Explore

1. `gitnexus_context({name: "send"})` — see callers and callees
2. `gitnexus_query({query: "tools"})` — find related execution flows
3. Read key files listed above for implementation details
