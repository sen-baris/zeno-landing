import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const routes = [
  { route: '/', html: 'dist/index.html', budget: 75 * 1024 },
  { route: '/product', html: 'dist/product/index.html', budget: 75 * 1024 },
  { route: '/ai-readiness', html: 'dist/ai-readiness/index.html', budget: 150 * 1024 },
  { route: '/demo', html: 'dist/demo/index.html', budget: 150 * 1024 },
];

let failed = false;

for (const entry of routes) {
  const html = readFileSync(entry.html, 'utf8');
  const externalAssets = new Set(
    Array.from(html.matchAll(/\/_astro\/[^"']+\.js/g), (match) => match[0]),
  );
  const inlineScripts = Array.from(
    html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g),
    (match) => match[1] ?? '',
  );

  const externalBytes = Array.from(externalAssets).reduce(
    (total, asset) => total + gzipSync(readFileSync(`dist${asset}`)).byteLength,
    0,
  );
  const inlineBytes = inlineScripts.reduce(
    (total, script) => total + gzipSync(script).byteLength,
    0,
  );
  const total = externalBytes + inlineBytes;
  const result = total <= entry.budget ? 'PASS' : 'FAIL';
  process.stdout.write(
    `${result} ${entry.route}: ${(total / 1024).toFixed(1)}KB gzip / ${(entry.budget / 1024).toFixed(0)}KB\n`,
  );
  if (total > entry.budget) failed = true;
}

if (failed) process.exitCode = 1;
