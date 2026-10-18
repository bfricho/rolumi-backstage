import assert from 'node:assert/strict';
import test from 'node:test';
import { renderMarkdown, renderRoadmapHtml, safeContentPath } from '../src/content.js';

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

test('content paths reject traversal', () => {
  assert.throws(() => safeContentPath('/tmp/content', '../secret.md'));
  assert.equal(safeContentPath('/tmp/content', '02_BRAND/README.md'), '/tmp/content/02_BRAND/README.md');
});
