#!/usr/bin/env node
// Keeps the shared bits of every page in step. Run it after changing a file in
// partials/, css/ or js/, or after adding a page or project:
//
//   node tools/sync.mjs           update the pages in place
//   node tools/sync.mjs --check   change nothing; exit 1 if a page is out of date
//
// The pages stay plain, complete HTML that you commit and deploy as they are.
// This script only rewrites three things inside them:
//
// 1. Shared blocks. Everything between <!-- shared:NAME --> and
//    <!-- /shared:NAME --> is replaced with partials/NAME.html. In a partial,
//    {{root}} becomes the path back to the site root ("" or "../"), and the nav
//    link to the current page gets aria-current="page".
//
// 2. Cache versions. Every link to a local .css or .js file gets ?v= set to a
//    short hash of that file, so browsers fetch it again only when it changes.
//
// 3. View-transition names. An element with data-project="ponder" starts a
//    project; each element after it with data-vt="media" (or title, desc,
//    tags) gets style="view-transition-name: ponder-media". The home page card
//    and the project page hero use the same data-project, so their names
//    always match.
//
// No dependencies; needs Node 18 or later.

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const skipDirs = new Set(['.git', 'node_modules', 'partials', 'tools', 'images']);

function findPages(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return skipDirs.has(entry.name) ? [] : findPages(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

const toPosix = (path) => path.split(sep).join('/');
const partials = new Map();
function partial(name) {
  if (!partials.has(name)) {
    const file = join(root, 'partials', `${name}.html`);
    if (!existsSync(file)) throw new Error(`No partial named "${name}" (expected partials/${name}.html)`);
    partials.set(name, readFileSync(file, 'utf8').trimEnd());
  }
  return partials.get(name);
}

const hashes = new Map();
function hashOf(file) {
  if (!hashes.has(file)) {
    hashes.set(file, createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 8));
  }
  return hashes.get(file);
}

// 1. Shared blocks
function fillShared(html, page) {
  const pageDir = dirname(page);
  const up = toPosix(relative(pageDir, root));
  const rootPrefix = up ? `${up}/` : '';
  const pageUrl = toPosix(relative(root, page));

  return html.replace(
    /^([ \t]*)<!-- shared:([\w-]+) -->[\s\S]*?<!-- \/shared:\2 -->/gm,
    (_, indent, name) => {
      let body = partial(name).replaceAll('{{root}}', rootPrefix);
      // Mark the nav link (not the logo) that points at this page.
      body = body.replace(/<a href="([^"]+)"(?![^>]*class="logo")([^>]*)>/g, (tag, href, rest) => {
        const target = posix.normalize(posix.join(posix.dirname(pageUrl), href));
        return target === pageUrl && !rest.includes('aria-current')
          ? `<a href="${href}"${rest} aria-current="page">`
          : tag;
      });
      const lines = body.split('\n').map((line) => (line ? indent + line : line));
      return `${indent}<!-- shared:${name} -->\n${lines.join('\n')}\n${indent}<!-- /shared:${name} -->`;
    },
  );
}

// 2. Cache versions
function stampVersions(html, page) {
  return html.replace(
    /\b(href|src)="((?![a-z]+:|\/\/|#)[^"?#]+\.(?:css|js))(?:\?v=[^"]*)?"/g,
    (match, attr, url) => {
      const file = resolve(dirname(page), url);
      return existsSync(file) ? `${attr}="${url}?v=${hashOf(file)}"` : match;
    },
  );
}

// 3. View-transition names
function nameTransitions(html, page, problems) {
  let project = null;
  const seen = new Set();
  const out = html.replace(/<[a-z][\w-]*\b[^>]*>/g, (tag) => {
    const projectAttr = tag.match(/\sdata-project="([^"]+)"/);
    if (projectAttr) project = projectAttr[1];
    const part = tag.match(/\sdata-vt="([^"]+)"/);
    if (!part) return tag;
    if (!project) {
      problems.push(`${toPosix(relative(root, page))}: data-vt="${part[1]}" has no data-project before it`);
      return tag;
    }
    const name = `${project}-${part[1]}`;
    if (seen.has(name)) problems.push(`${toPosix(relative(root, page))}: view-transition-name "${name}" is used twice`);
    seen.add(name);

    const style = tag.match(/\sstyle="([^"]*)"/);
    const others = style
      ? style[1].split(';').map((d) => d.trim()).filter((d) => d && !/^view-transition-name\s*:/.test(d))
      : [];
    const value = [`view-transition-name: ${name}`, ...others].join('; ');
    return style ? tag.replace(style[0], ` style="${value}"`) : tag.replace(/\s*(\/?)>$/, ` style="${value}"$1>`);
  });
  return out;
}

const problems = [];
const stale = [];
for (const page of findPages(root)) {
  const before = readFileSync(page, 'utf8');
  let html = fillShared(before, page);
  html = stampVersions(html, page);
  html = nameTransitions(html, page, problems);
  if (html !== before) {
    stale.push(toPosix(relative(root, page)));
    if (!check) writeFileSync(page, html);
  }
}

for (const problem of problems) console.error(`warning: ${problem}`);
if (check) {
  if (stale.length) {
    console.error(`Out of date: ${stale.join(', ')}\nRun: node tools/sync.mjs`);
    process.exit(1);
  }
  console.log('All pages are up to date.');
} else {
  console.log(stale.length ? `Updated: ${stale.join(', ')}` : 'All pages were already up to date.');
}
