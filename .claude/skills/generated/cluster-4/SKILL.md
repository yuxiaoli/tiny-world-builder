---
name: cluster-4
description: "Skill for the Cluster_4 area of tiny-world-builder. 7 symbols across 1 files."
---

# Cluster_4

7 symbols | 1 files | Cohesion: 86%

## When to Use

- Understanding how _queueChunkBuild, _trimPendingChunkBuilds, setBiome work
- Modifying cluster_4-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `LandscapeEngine.js` | _queueChunkBuild, _trimPendingChunkBuilds, setBiome, setStyleMode, clearChunks (+2) |

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `_queueChunkBuild` | Method | `LandscapeEngine.js` | 1123 |
| `_trimPendingChunkBuilds` | Method | `LandscapeEngine.js` | 1130 |
| `setBiome` | Method | `LandscapeEngine.js` | 1168 |
| `setStyleMode` | Method | `LandscapeEngine.js` | 1204 |
| `clearChunks` | Method | `LandscapeEngine.js` | 1268 |
| `update` | Method | `LandscapeEngine.js` | 1293 |
| `dispose` | Method | `LandscapeEngine.js` | 1393 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Constructor → ClearChunks` | cross_community | 6 |
| `Update → _clamp01` | cross_community | 6 |
| `Update → _smoothstep` | cross_community | 6 |
| `Update → _hash2` | cross_community | 6 |
| `Update → _strataColor` | cross_community | 4 |
| `Update → _srand` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Cluster_2 | 1 calls |

## How to Explore

1. `gitnexus_context({name: "_queueChunkBuild"})` — see callers and callees
2. `gitnexus_query({query: "cluster_4"})` — find related execution flows
3. Read key files listed above for implementation details
