---
name: examples
description: "Skill for the Examples area of tiny-world-builder. 44 symbols across 6 files."
---

# Examples

44 symbols | 6 files | Cohesion: 87%

## When to Use

- Working with code in `plugins/`
- Understanding how sleep, usage, parseArgs work
- Modifying examples-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `plugins/examples/vehicle-road-demo.js` | sleep, usage, parseArgs, getJson, waitForBrowserClient (+16) |
| `plugins/examples/mcp-stdio-bridge.js` | send, result, error, handle, postCommand (+3) |
| `plugins/examples/send-command.js` | usage, parseArgs, number, bool, main |
| `plugins/examples/webhook-receiver.js` | readLog, appendEvent, send, readBody, server |
| `plugins/examples/sse-command-relay.js` | sendJson, readBody, broadcast, server |
| `tools/dev-server.js` | openaiRequest |

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `McpBridgeClient` | Class | `plugins/examples/vehicle-road-demo.js` | 117 |
| `sleep` | Function | `plugins/examples/vehicle-road-demo.js` | 21 |
| `usage` | Function | `plugins/examples/vehicle-road-demo.js` | 23 |
| `parseArgs` | Function | `plugins/examples/vehicle-road-demo.js` | 47 |
| `getJson` | Function | `plugins/examples/vehicle-road-demo.js` | 95 |
| `waitForBrowserClient` | Function | `plugins/examples/vehicle-road-demo.js` | 102 |
| `makeRoadCells` | Function | `plugins/examples/vehicle-road-demo.js` | 218 |
| `addRoad` | Function | `plugins/examples/vehicle-road-demo.js` | 220 |
| `paintRoadNetwork` | Function | `plugins/examples/vehicle-road-demo.js` | 241 |
| `place` | Function | `plugins/examples/vehicle-road-demo.js` | 246 |
| `spawnVehicles` | Function | `plugins/examples/vehicle-road-demo.js` | 265 |
| `runRetargetLoop` | Function | `plugins/examples/vehicle-road-demo.js` | 297 |
| `main` | Function | `plugins/examples/vehicle-road-demo.js` | 319 |
| `openaiRequest` | Function | `tools/dev-server.js` | 226 |
| `usage` | Function | `plugins/examples/send-command.js` | 6 |
| `parseArgs` | Function | `plugins/examples/send-command.js` | 50 |
| `number` | Function | `plugins/examples/send-command.js` | 70 |
| `bool` | Function | `plugins/examples/send-command.js` | 75 |
| `main` | Function | `plugins/examples/send-command.js` | 85 |
| `readLog` | Function | `plugins/examples/webhook-receiver.js` | 21 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Main → OnStdout` | cross_community | 4 |
| `Main → Send` | cross_community | 4 |
| `Server → Tt` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Cluso | 4 calls |
| Scratch | 1 calls |

## How to Explore

1. `gitnexus_context({name: "sleep"})` — see callers and callees
2. `gitnexus_query({query: "examples"})` — find related execution flows
3. Read key files listed above for implementation details
