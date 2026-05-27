---
name: cluster-1
description: "Skill for the Cluster_1 area of tiny-world-builder. 8 symbols across 1 files."
---

# Cluster_1

8 symbols | 1 files | Cohesion: 88%

## When to Use

- Understanding how _smoothstep, _clamp01, _smoothstepRange work
- Modifying cluster_1-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `LandscapeEngine.js` | _smoothstep, _clamp01, _smoothstepRange, _hash2, _vnoise (+3) |

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `_smoothstep` | Method | `LandscapeEngine.js` | 133 |
| `_clamp01` | Method | `LandscapeEngine.js` | 134 |
| `_smoothstepRange` | Method | `LandscapeEngine.js` | 135 |
| `_hash2` | Method | `LandscapeEngine.js` | 140 |
| `_vnoise` | Method | `LandscapeEngine.js` | 150 |
| `_fbm` | Method | `LandscapeEngine.js` | 162 |
| `_airfieldMasks` | Method | `LandscapeEngine.js` | 215 |
| `getHeight` | Method | `LandscapeEngine.js` | 243 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Update → _clamp01` | cross_community | 6 |
| `Update → _smoothstep` | cross_community | 6 |
| `Update → _hash2` | cross_community | 6 |

## How to Explore

1. `gitnexus_context({name: "_smoothstep"})` — see callers and callees
2. `gitnexus_query({query: "cluster_1"})` — find related execution flows
3. Read key files listed above for implementation details
