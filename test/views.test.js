import assert from 'node:assert/strict';
import test from 'node:test';
import { roadmapPage } from '../src/views.js';

test('roadmap opens with the ROLUMI 2030 transformation headline', () => {
  const html = roadmapPage({
    appName: 'ROLUMI Backstage',
    documents: [],
    timeline: '<div class="roadmap-timeline"></div>',
  });

  assert.match(html, /ROLUMI 2030/u);
  assert.match(html, /Staviame na 20 rokoch skúseností\./u);
  assert.match(html, /Spoločne tvoríme nové ROLUMI\./u);
  assert.match(html, /Z tradičného maloobchodu sa meníme na strategického partnera/u);
  assert.match(html, /celú stavbu\. Zákazníkom tak prinášame istotu/u);
  assert.doesNotMatch(html, /novú ROLUMI/u);
  assert.doesNotMatch(html, /[—–]/u);
});
