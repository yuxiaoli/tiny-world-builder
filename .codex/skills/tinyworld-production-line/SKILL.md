---
name: tinyworld-production-line
description: Use when maintaining the fork's production-line workflow or its safe draft/status automation.
---

# Fork production-line maintenance

- All fork automation writes belong on `develop`; `main` is an owner-reserved source branch.
- Pin production-line checkout to `develop` and guard the job against manual dispatches from other refs.
- Commit drafts/status with a normal push to `HEAD:refs/heads/develop`. A concurrent remote update must reject the push; never force it or overwrite generated content.
- Compare autonomous changes with `origin/develop` and open review PRs against `develop`.
- Preserve the hourly schedule, opt-in variable/secret gate, economy denylist, generated drafts, and status history.
- Before dispatching, verify the operative workflow on the default branch has these targets. Never rerun a historical workflow that pushes to `main`.
- Validate with `npm test`, the Pages build, and the existing real-WebGL default/snowy-fixture smoke checks. Distinguish local browser checks from live Pages checks.
