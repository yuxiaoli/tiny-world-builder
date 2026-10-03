#!/usr/bin/env bash
set -euo pipefail

# Compatibility entry point for the fork's Pages workflow. Keep the current
# upstream publisher at the repo root so Netlify/Vercel and static checks agree.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
bash "$ROOT/publish.sh" "$@"
if [[ "${GITHUB_PAGES:-false}" == "true" ]]; then
  # Keep the fork's existing editor-first entry point on GitHub Pages.
  cp "$ROOT/dist/index.html" "$ROOT/dist/landing.html"
  cp "$ROOT/dist/tiny-world-builder.html" "$ROOT/dist/index.html"
  node "$ROOT/tools/prepare-pages.js" "$ROOT/dist" "${PAGES_BASE_PATH:-/tiny-world-builder/}"
fi
