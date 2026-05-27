---
name: cluster-0
description: "Skill for the Cluster_0 area of tiny-world-builder. 4 symbols across 1 files."
---

# Cluster_0

4 symbols | 1 files | Cohesion: 86%

## When to Use

- Understanding how constructor, _makeAirfieldConfig, _initSharedShaders work
- Modifying cluster_0-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `LandscapeEngine.js` | constructor, _makeAirfieldConfig, _initSharedShaders, _initWater |

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `constructor` | Method | `LandscapeEngine.js` | 20 |
| `_makeAirfieldConfig` | Method | `LandscapeEngine.js` | 172 |
| `_initSharedShaders` | Method | `LandscapeEngine.js` | 298 |
| `_initWater` | Method | `LandscapeEngine.js` | 755 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Constructor → ClearChunks` | cross_community | 6 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Scratch | 1 calls |

## How to Explore

1. `gitnexus_context({name: "constructor"})` — see callers and callees
2. `gitnexus_query({query: "cluster_0"})` — find related execution flows
3. Read key files listed above for implementation details
