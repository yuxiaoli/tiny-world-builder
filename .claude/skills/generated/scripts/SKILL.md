---
name: scripts
description: "Skill for the Scripts area of tiny-world-builder. 5 symbols across 1 files."
---

# Scripts

5 symbols | 1 files | Cohesion: 100%

## When to Use

- Working with code in `scripts/`
- Understanding how append_skills, run_cypher, cmd_export_lbug work
- Modifying scripts-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `scripts/export_lbug_to_md.py` | append_skills, run_cypher, cmd_export_lbug, cmd_combine_skills, main |

## Entry Points

Start here when exploring this area:

- **`append_skills`** (Function) — `scripts/export_lbug_to_md.py:14`
- **`run_cypher`** (Function) — `scripts/export_lbug_to_md.py:43`
- **`cmd_export_lbug`** (Function) — `scripts/export_lbug_to_md.py:65`
- **`cmd_combine_skills`** (Function) — `scripts/export_lbug_to_md.py:155`
- **`main`** (Function) — `scripts/export_lbug_to_md.py:170`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `append_skills` | Function | `scripts/export_lbug_to_md.py` | 14 |
| `run_cypher` | Function | `scripts/export_lbug_to_md.py` | 43 |
| `cmd_export_lbug` | Function | `scripts/export_lbug_to_md.py` | 65 |
| `cmd_combine_skills` | Function | `scripts/export_lbug_to_md.py` | 155 |
| `main` | Function | `scripts/export_lbug_to_md.py` | 170 |

## How to Explore

1. `gitnexus_context({name: "append_skills"})` — see callers and callees
2. `gitnexus_query({query: "scripts"})` — find related execution flows
3. Read key files listed above for implementation details
