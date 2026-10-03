#!/usr/bin/env bash
set -euo pipefail

# Compatibility entry point for the fork's Pages workflow. Keep the current
# upstream publisher at the repo root so Netlify/Vercel and static checks agree.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec bash "$ROOT/publish.sh" "$@"
