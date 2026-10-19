import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import {
  loadContentIndex,
  renderMarkdown,
  renderRoadmapHtml,
  renderRoadmapTimeline,
  safeContentPath,
} from '../src/content.js';

test('markdown links stay inside the authenticated content routes', () => {
  const html = renderMarkdown(
    '[Dokument](../02_BRAND/README.md) [Katalóg](../02_BRAND/Design%20System/index.html)',
    '03_STRATEGIA_A_POSITIONING/README.md',
  );
  assert.match(html, /href="\/docs\/02_BRAND\/README.md"/);
  assert.match(html, /href="\/content\/02_BRAND\/Design%20System\/index.html"/);
});

test('raw HTML is not executed by the markdown renderer', () => {
  const html = renderMarkdown('<script>alert(1)</script>', 'ROADMAP.md');
  assert.doesNotMatch(html, /<script>/);
});

test('the original roadmap HTML keeps its design and routes its assets and documents through the app', () => {
  const source = '<style>@font-face{src:url("02_BRAND/font.woff2")}</style><img src="02_BRAND/logo.svg"><a href="03_STRATEGIA/doc.md">Dokument</a>';
  const html = renderRoadmapHtml(source);
  assert.match(html, /url\("\/content\/02_BRAND\/font\.woff2"\)/u);
  assert.match(html, /src="\/content\/02_BRAND\/logo\.svg"/u);
  assert.match(html, /href="\/docs\/03_STRATEGIA\/doc\.md"/u);
});

test('the roadmap timeline can be embedded in the Backstage shell without its standalone chrome', () => {
  const source = '<header>Standalone</header><main id="roadmapa" class="timeline" aria-label="Roadmap"><a href="02_BRAND/BRAND_AUDIT.md">Brand</a></main><footer>Footer</footer>';
  const html = renderRoadmapTimeline(source);
  assert.match(html, /^<div class="roadmap-timeline"/u);
  assert.match(html, /href="\/docs\/02_BRAND\/BRAND_AUDIT\.md"/u);
  assert.doesNotMatch(html, /Standalone|Footer/u);
});

test('content paths reject traversal', () => {
  assert.throws(() => safeContentPath('/tmp/content', '../secret.md'));
  assert.equal(safeContentPath('/tmp/content', '02_BRAND/README.md'), '/tmp/content/02_BRAND/README.md');
});

test('Brand navigation exposes only the approved three entries', async () => {
  const index = await loadContentIndex(path.resolve('content'));
  const brandPaths = index.documents
    .filter((document) => document.section === '02_BRAND')
    .map((document) => document.path);

  assert.deepEqual(brandPaths, [
    '02_BRAND/BRAND_AUDIT.md',
    '02_BRAND/Design System/README.md',
    '02_BRAND/TODO.md',
  ]);
  assert.equal(index.allFiles.has('02_BRAND/DECISIONS.md'), true);
});

test('resolved warehouse topic stays available without appearing in the sidebar', async () => {
  const index = await loadContentIndex(path.resolve('content'));
  const warehousePath = '03_STRATEGIA_A_POSITIONING/02_SKLAD_ROLUMI_A_OZNAMENIE.md';
  const warehouse = index.documents.find((document) => document.path === warehousePath);

  assert.equal(index.allFiles.has(warehousePath), true);
  assert.equal(warehouse?.sidebar, false);
});
