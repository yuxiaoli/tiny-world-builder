// Headless boot smoke for the builder page.
//
// Loads /tiny-world-builder in a real headless Chromium and fails if the app
// throws an uncaught exception while booting (pageerror) or never reaches a
// ready state. This closes the "page white-screens / TDZ throw in prod" class
// that unit tests can't see because the whole engine is classic <script>s that
// only execute in a browser. Kept OUT of `npm test` (that stays browser-free
// and fast); run via `npm run smoke:boot` with a dev server already up, or in
// CI as its own job that starts the server first.
//
// Env:
//   BASE_URL   base origin to hit (default http://localhost:3000)
//   BOOT_TIMEOUT_MS  ready-poll budget (default 30000)
//
// Exit 0 = booted clean; exit 1 = uncaught error or never ready.

import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);

// Find an installed Playwright chromium binary in the ms-playwright cache. The
// bundled playwright version and the on-disk browser build can drift locally
// (a different playwright installed the browsers); rather than force a redownload
// we point launch() at whatever headless-shell/chromium is actually present.
function findInstalledChromium() {
  const cache = process.env.PLAYWRIGHT_BROWSERS_PATH
    || path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright');
  let dirs = [];
  try { dirs = fs.readdirSync(cache); } catch (_) { return null; }
  const rel = process.platform === 'darwin'
    ? [['chrome-headless-shell-mac-arm64', 'chrome-headless-shell'],
       ['chrome-headless-shell-mac-x64', 'chrome-headless-shell'],
       ['chrome-mac', 'Chromium.app/Contents/MacOS/Chromium']]
    : [['chrome-headless-shell-linux', 'chrome-headless-shell'],
       ['chrome-linux', 'chrome'],
       ['chrome-linux', 'headless_shell']];
  const shells = dirs.filter((d) => /^chromium_headless_shell-/.test(d)).sort().reverse();
  const fulls = dirs.filter((d) => /^chromium-/.test(d)).sort().reverse();
  for (const d of [...shells, ...fulls]) {
    for (const [sub, bin] of rel) {
      const p = path.join(cache, d, sub, bin);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

async function launchChromium(chromium) {
  try {
    return await chromium.launch({ headless: true });
  } catch (err) {
    const exe = findInstalledChromium();
    if (exe) return chromium.launch({ headless: true, executablePath: exe });
    try { return await chromium.launch({ headless: true, channel: 'chrome' }); } catch (_) {}
    throw err;
  }
}

// Resolve Playwright's chromium from either a root install (CI) or the
// build-bridge sub-package (local dev), so no new root dependency is required.
function loadChromium() {
  // build-bridge first: its bundled browser build matches its playwright
  // version. A root/global playwright may point at a different (missing) build.
  const candidates = [
    './build-bridge/node_modules/playwright/index.js',
    './build-bridge/node_modules/playwright-core/index.js',
    'playwright',
    'playwright-core',
  ];
  for (const id of candidates) {
    try {
      const mod = require(id.startsWith('.') ? new URL(id, import.meta.url).pathname : id);
      if (mod && mod.chromium) return mod.chromium;
    } catch (_) { /* try next */ }
  }
  throw new Error('Playwright chromium not found. In CI: `npm i --no-save playwright && npx playwright install --with-deps chromium`.');
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const BOOT_TIMEOUT_MS = Number(process.env.BOOT_TIMEOUT_MS || 30000);
const BOOT_PATH = process.env.BOOT_PATH || '/tiny-world-builder';
const TARGET = BASE_URL.replace(/\/$/, '') + BOOT_PATH;
const EXPECT_WORLD_FIXTURE = process.env.EXPECT_WORLD_FIXTURE || '';

// Console errors that are known dev-only noise, not app-boot failures. The
// cluso feedback widget is injected only by the local dev server (never shipped,
// never in CI) and logs a couple of benign errors; ignore only those.
const BENIGN_CONSOLE = [/selectedTool is not defined/i, /cluso/i];

function isBenign(text) {
  return BENIGN_CONSOLE.some((re) => re.test(text || ''));
}

async function main() {
  const chromium = loadChromium();
  const browser = await launchChromium(chromium);
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (err) => { pageErrors.push(String(err && err.stack || err)); });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!isBenign(text)) consoleErrors.push(text);
    }
  });

  let ready = false;
  let readyDetail = null;
  try {
    await page.goto(TARGET, { waitUntil: 'domcontentloaded', timeout: BOOT_TIMEOUT_MS });
    // Require a live WebGL context and actual rendered geometry, not just a
    // canvas element or late globals. Disabled/software-broken WebGL must fail.
    await page.waitForFunction(() => {
      const lateModules = typeof window.enterFlightSpawn === 'function'
        && !!window.__tinyworldPoserSurface;
      const bigCanvas = Array.from(document.querySelectorAll('canvas'))
        .some((c) => c.width > 400 && c.height > 300);
      const drawing = typeof renderer !== 'undefined' && renderer.getContext()
        && !renderer.getContext().isContextLost()
        && renderer.info.render.calls > 0 && renderer.info.render.triangles > 0
        && typeof scene !== 'undefined' && scene.children.length > 0;
      return lateModules && bigCanvas && drawing;
    }, null, { timeout: BOOT_TIMEOUT_MS });
    if (EXPECT_WORLD_FIXTURE) {
      const expected = JSON.parse(fs.readFileSync(path.resolve(EXPECT_WORLD_FIXTURE), 'utf8'));
      await page.waitForFunction((data) => {
        if (typeof GRID === 'undefined' || GRID !== data.gridSize || typeof world === 'undefined') return false;
        return data.cells.every((cell) => {
          const c = Array.isArray(cell) ? { x: cell[0], z: cell[1], terrain: cell[2], kind: cell[3] } : cell;
          const actual = world[c.x] && world[c.x][c.z];
          return actual && actual.terrain === c.terrain && actual.kind === (c.kind || null);
        });
      }, expected, { timeout: BOOT_TIMEOUT_MS });
    }
    ready = true;
    // Let the render loop run a few seconds so animation-loop-time throws
    // (e.g. a bad path in the per-frame tick) surface as pageerrors too.
    await page.waitForTimeout(3000);
    readyDetail = await page.evaluate(() => ({
      hasFlight: typeof window.enterFlightSpawn === 'function',
      hasPoser: !!window.__tinyworldPoserSurface,
      webglVersion: renderer.getContext().getParameter(renderer.getContext().VERSION),
      drawCalls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
      sceneChildren: scene.children.length,
      gridSize: typeof GRID !== 'undefined' ? GRID : null,
      canvases: Array.from(document.querySelectorAll('canvas')).map((c) => c.width + 'x' + c.height),
    }));
  } catch (err) {
    readyDetail = { error: String(err && err.message || err) };
  } finally {
    await browser.close();
  }

  const fatal = pageErrors.length > 0 || !ready;
  console.log('boot smoke: ' + TARGET);
  if (EXPECT_WORLD_FIXTURE) console.log('  expected world fixture: ' + EXPECT_WORLD_FIXTURE);
  console.log('  ready: ' + ready + (readyDetail ? '  ' + JSON.stringify(readyDetail) : ''));
  console.log('  uncaught page errors: ' + pageErrors.length);
  for (const e of pageErrors) console.log('    ! ' + e.split('\n')[0]);
  if (consoleErrors.length) {
    console.log('  console.error (non-fatal, reported): ' + consoleErrors.length);
    for (const e of consoleErrors.slice(0, 10)) console.log('    - ' + e.split('\n')[0]);
  }

  if (fatal) {
    console.error('boot smoke FAILED' + (ready ? '' : ' (never reached ready state)'));
    process.exit(1);
  }
  console.log('boot smoke ok');
}

main().catch((err) => { console.error('boot smoke crashed:', err); process.exit(1); });
