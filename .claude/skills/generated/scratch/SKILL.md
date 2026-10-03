---
name: scratch
description: "Skill for the Scratch area of tiny-world-builder. 22 symbols across 5 files."
---

# Scratch

22 symbols | 5 files | Cohesion: 92%

## When to Use

- Working with code in `scratch/`
- Understanding how get, authorized, fadeBucketFor work
- Modifying scratch-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `scratch/test_unit.js` | fadeBucketFor, desaturateMaterial, pickFadeMaterial, normalizeHexColor, customMaterial (+5) |
| `LandscapeEngine.js` | _initSharedGeometries, _mergeColored, _buildPineGeo, _buildCactusGeo, _buildShrubGeo (+1) |
| `scratch/visual_qa.js` | sendCommand, captureScreenshot, delay, getPageTargetWithRetry |
| `cluso/cluso-embed.js` | get |
| `plugins/examples/sse-command-relay.js` | authorized |

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `get` | Function | `cluso/cluso-embed.js` | 7 |
| `authorized` | Function | `plugins/examples/sse-command-relay.js` | 37 |
| `fadeBucketFor` | Function | `scratch/test_unit.js` | 60 |
| `desaturateMaterial` | Function | `scratch/test_unit.js` | 63 |
| `pickFadeMaterial` | Function | `scratch/test_unit.js` | 65 |
| `normalizeHexColor` | Function | `scratch/test_unit.js` | 86 |
| `customMaterial` | Function | `scratch/test_unit.js` | 89 |
| `set` | Function | `scratch/test_unit.js` | 141 |
| `clone` | Function | `scratch/test_unit.js` | 127 |
| `coerceGridSize` | Function | `scratch/test_unit.js` | 30 |
| `renderBudgetForGrid` | Function | `scratch/test_unit.js` | 34 |
| `maxRenderVisibleSizeForGrid` | Function | `scratch/test_unit.js` | 50 |
| `sendCommand` | Function | `scratch/visual_qa.js` | 32 |
| `captureScreenshot` | Function | `scratch/visual_qa.js` | 44 |
| `delay` | Function | `scratch/visual_qa.js` | 40 |
| `getPageTargetWithRetry` | Function | `scratch/visual_qa.js` | 53 |
| `_initSharedGeometries` | Method | `LandscapeEngine.js` | 551 |
| `_mergeColored` | Method | `LandscapeEngine.js` | 640 |
| `_buildPineGeo` | Method | `LandscapeEngine.js` | 681 |
| `_buildCactusGeo` | Method | `LandscapeEngine.js` | 694 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Constructor → ClearChunks` | cross_community | 6 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Cluster_4 | 1 calls |

## How to Explore

1. `gitnexus_context({name: "get"})` — see callers and callees
2. `gitnexus_query({query: "scratch"})` — find related execution flows
3. Read key files listed above for implementation details
