#!/usr/bin/env node
// Adapt the static dist to GitHub project Pages without changing source routes
// used by Netlify/Vercel. Only known local pages/assets are rewritten; APIs and
// external URLs retain their existing behavior.
const fs = require('node:fs');
const path = require('node:path');

function preparePages(dist, basePath) {
  if (!/^\/[a-zA-Z0-9_-]+\/$/.test(basePath)) throw new Error('invalid Pages base path');
  let changed = 0;
  function localUrl(url) {
    if (url === '/') return url;
    const match = url.match(/^([^?#]*)([?#].*)?$/);
    const pathname = match[1];
    const suffix = match[2] || '';
    if (pathname.startsWith(basePath) || pathname.includes('..')) return url;
    const target = path.join(dist, pathname.slice(1));
    if (fs.existsSync(target) && fs.statSync(target).isFile()) return basePath + pathname.slice(1) + suffix;
    if (fs.existsSync(target + '.html')) return basePath + pathname.slice(1) + '.html' + suffix;
    // Dynamic asset paths (e.g. '/models/' + name) need the same base prefix.
    const dir = pathname.split('/')[1];
    if (['assets', 'data', 'engine', 'icons', 'models', 'scripts', 'sounds', 'styles', 'textures', 'vendor', 'crowd'].includes(dir)) {
      return basePath + pathname.slice(1) + suffix;
    }
    return url;
  }
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const file = path.join(dir, name);
      if (fs.statSync(file).isDirectory()) { if (name !== 'vendor') walk(file); continue; }
      if (!/\.(html|js|css)$/.test(name)) continue;
      const source = fs.readFileSync(file, 'utf8');
      let next = source.replace(/(["'`])\/(?!\/)([^"'`\s<>]*)/g, (all, quote, rest) => quote + localUrl('/' + rest));
      next = next.replace(/(href=|(?:window\.)?location\.href\s*=\s*)(["'])\/\2/g, (_, prefix, quote) => prefix + quote + basePath + quote);
      if (source !== next) { fs.writeFileSync(file, next); changed++; }
    }
  }
  walk(dist);
  return changed;
}

module.exports = { preparePages };
if (require.main === module) {
  const changed = preparePages(path.resolve(process.argv[2] || 'dist'), process.argv[3] || '/tiny-world-builder/');
  console.log('GitHub Pages: adapted ' + changed + ' static files');
}
