import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { buildEngineFns } from './helpers/extract-fn.mjs';

const root = new URL('../', import.meta.url);
const statePath = new URL('engine/world/29-persistence-api.js', root);
const source = readFileSync(statePath, 'utf8');
const urlCode = source.slice(source.indexOf('  function isTinyverseSlugParam('), source.indexOf('  // Apply the bundled default island'));
function urlRuntime(href = 'https://example.test/tiny-world-builder/tiny-world-builder.html', overrides = {}) {
  const ctx = vm.createContext({
    URL, URLSearchParams, AbortSignal,
    window: { location: new URL(href) },
    TINYVERSE_DEFAULT_SLUG: 'default-world',
    console: { warn() {}, error() {} },
    ...overrides,
  });
  vm.runInContext(urlCode, ctx);
  return ctx;
}

const { validateWorld } = buildEngineFns(new URL('engine/world/26-ai-generation.js', root), ['validateWorld'], `
const STORAGE_VERSION = 4;
const isValidGridSize = (size) => [8, 10, 12, 16, 20].includes(size);
const EDITABLE_ISLAND_ENGINE_TYPES = new Set(['rocket']);
const MOORING_CABLE_MAX = 64;
const normalizeAppearance = (value) => value;
`);

test('fork world URLs preserve query/hash precedence and inline JSON', () => {
  const data = JSON.stringify({ v: 4, cells: [] });
  const ctx = urlRuntime('https://example.test/tiny-world-builder/?world=data/a.json#world=data/b.json');
  assert.equal(ctx.getWorldUrlParam(), 'data/a.json');
  ctx.window.location = new URL('https://example.test/tiny-world-builder/#world=' + encodeURIComponent(data));
  assert.equal(ctx.getWorldUrlParam(), data);
  assert.equal(ctx.isInlineWorldParam('  ' + data), true);
  assert.equal(ctx.sanitizeWorldUrl(data), null);
  ctx.window.location = new URL('https://example.test/?world=tidewater-bay');
  assert.equal(ctx.getWorldUrlParam(), null);
  assert.equal(ctx.getTinyverseSlugParam(), 'tidewater-bay');
});

test('fork world URLs allow public HTTP(S) and project-relative JSON, reject unsafe schemes and credentials', () => {
  const ctx = urlRuntime();
  assert.equal(ctx.sanitizeWorldUrl('data/world.snowy_village.json'), 'https://example.test/tiny-world-builder/data/world.snowy_village.json');
  assert.equal(ctx.sanitizeWorldUrl('https://other.test/world.json'), 'https://other.test/world.json');
  assert.equal(ctx.sanitizeWorldUrl('http://other.test/world.json'), 'http://other.test/world.json');
  for (const url of ['javascript:alert(1)', 'file:///tmp/world.json', 'data:application/json,{}', 'https://user:pass@other.test/world.json']) {
    assert.equal(ctx.sanitizeWorldUrl(url), null);
  }
});

test('remote worlds load asynchronously without credentials or referrer', async () => {
  let request;
  let applied;
  let resets = 0;
  const data = { v: 4, cells: [] };
  const ctx = urlRuntime(undefined, {
    fetch: async (url, options) => { request = { url, options }; return { ok: true, json: async () => data }; },
    applyState: (value) => { applied = value; return true; },
    resetCameraDefaults: () => { resets++; },
  });
  assert.equal(await ctx.loadWorldFromUrl('https://other.test/world.json'), true);
  assert.equal(applied, data);
  assert.equal(request.options.credentials, 'omit');
  assert.equal(request.options.referrerPolicy, 'no-referrer');
  assert.equal(resets, 1);
  ctx.fetch = async () => ({ ok: false });
  assert.equal(await ctx.loadWorldFromUrl('data/missing.json'), false);
  ctx.fetch = async () => { throw new Error('CORS/network'); };
  assert.equal(await ctx.loadWorldFromUrl('https://other.test/world.json'), false);
  assert.equal(resets, 1);
});

test('fork sample worlds remain compatible with the actual modular validator', () => {
  for (const name of ['world.example.json', 'world.test.json', 'world.snowy_village.json']) {
    const data = JSON.parse(readFileSync(new URL('data/' + name, root), 'utf8'));
    assert.equal(validateWorld(data), null, name);
  }
  const valid = { v: 4, cells: [[0, 0, 'grass', 'model-stamp']], toolId: 'select', gridSize: 10 };
  assert.equal(validateWorld(valid), null);
  assert.match(validateWorld({ ...valid, toolId: 2 }), /toolId/);
  assert.match(validateWorld({ ...valid, useLandscapeEngine: 'true' }), /useLandscapeEngine/);
  assert.match(validateWorld({ ...valid, planetLandscape: { drop: 301 } }), /planetLandscape.drop/);
  assert.match(validateWorld({ ...valid, cells: [{ x: 0, z: 0, terrain: 'grass', extras: [null] }] }), /extras/);
  assert.match(validateWorld({ ...valid, cells: [{ x: 0, z: 0, terrain: 'grass', transform: [0, 'bad', 0] }] }), /transform/);
});

function externalRefs(value) {
  if (Array.isArray(value)) return value.map(externalRefs);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k === '$ref' && v.startsWith('#/$defs/') ? 'world.schema.json' + v : externalRefs(v)]));
  return value;
}

test('extracted schemas stay in sync with the modern app contract', () => {
  const schema = JSON.parse(readFileSync(new URL('world.schema.json', root), 'utf8'));
  assert.deepEqual(JSON.parse(readFileSync(new URL('data/world.schema.json', root), 'utf8')), schema);
  for (const name of ['appearance', 'cellObject', 'extra', 'transform', 'planetLandscape']) {
    const standalone = JSON.parse(readFileSync(new URL('data/' + name + '.schema.json', root), 'utf8'));
    delete standalone.$schema; delete standalone.$id; delete standalone.title;
    assert.deepEqual(standalone, externalRefs(name === 'planetLandscape' ? schema.properties[name] : schema.$defs[name]));
  }
  assert.ok(schema.$defs.kind.enum.includes('model-stamp'));
  assert.ok(schema.$defs.appearance.properties.modelStampId);
});
