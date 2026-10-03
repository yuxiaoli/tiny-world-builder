---
name: cluster-2
description: "Skill for the Cluster_2 area of tiny-world-builder. 5 symbols across 1 files."
---

# Cluster_2

5 symbols | 1 files | Cohesion: 71%

## When to Use

- Understanding how _srand, _strataColor, _makeChunk work
- Modifying cluster_2-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `LandscapeEngine.js` | _srand, _strataColor, _makeChunk, _makeFarChunk, _processChunkBuildQueues |

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `_srand` | Method | `LandscapeEngine.js` | 145 |
| `_strataColor` | Method | `LandscapeEngine.js` | 285 |
| `_makeChunk` | Method | `LandscapeEngine.js` | 888 |
| `_makeFarChunk` | Method | `LandscapeEngine.js` | 1070 |
| `_processChunkBuildQueues` | Method | `LandscapeEngine.js` | 1138 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Update → _clamp01` | cross_community | 6 |
| `Update → _smoothstep` | cross_community | 6 |
| `Update → _hash2` | cross_community | 6 |
| `Update → _strataColor` | cross_community | 4 |
| `Update → _srand` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Cluster_1 | 3 calls |

## How to Explore

1. `gitnexus_context({name: "_srand"})` — see callers and callees
2. `gitnexus_query({query: "cluster_2"})` — find related execution flows
3. Read key files listed above for implementation details
