import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const { preparePages } = createRequire(import.meta.url)('../tools/prepare-pages.js');

test('Pages adapts known static paths, preserving APIs, external URLs and slash operations', () => {
  const dist = mkdtempSync(join(tmpdir(), 'tiny-pages-'));
  try {
    for (const name of ['vendor', 'assets', 'engine']) mkdirSync(join(dist, name));
    writeFileSync(join(dist, 'tiny-world-builder.html'), '<a href="/">Home</a>');
    writeFileSync(join(dist, 'index.html'), '<a href="/tiny-world-builder?world=data/world.json#demo">Build</a><a href="/api/worlds">API</a><a href="//external.test/a">External</a>');
    writeFileSync(join(dist, 'engine', 'example.js'), `window.location.href = '/'; const parts = url.split('/'); const asset = '/assets/' + name; fetch('/api/worlds');`);
    writeFileSync(join(dist, 'vendor', 'example.js'), `const root = '/assets/test';`);
    preparePages(dist, '/tiny-world-builder/');
    assert.match(readFileSync(join(dist, 'index.html'), 'utf8'), /href="\/tiny-world-builder\/tiny-world-builder.html\?world=data\/world.json#demo"/);
    assert.match(readFileSync(join(dist, 'index.html'), 'utf8'), /href="\/api\/worlds"/);
    assert.match(readFileSync(join(dist, 'index.html'), 'utf8'), /href="\/\/external.test\/a"/);
    const js = readFileSync(join(dist, 'engine', 'example.js'), 'utf8');
    assert.ok(js.includes("window.location.href = '/tiny-world-builder/'"));
    assert.ok(js.includes("url.split('/')"));
    assert.ok(js.includes("'/tiny-world-builder/assets/' + name"));
    assert.ok(js.includes("fetch('/api/worlds')"));
    assert.equal(readFileSync(join(dist, 'vendor', 'example.js'), 'utf8'), "const root = '/assets/test';");
    assert.equal(preparePages(dist, '/tiny-world-builder/'), 0, 'adaptation must be idempotent');
  } finally { rmSync(dist, { recursive: true, force: true }); }
});
