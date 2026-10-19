import assert from 'node:assert/strict';
import test from 'node:test';
import { historyPage, roadmapPage } from '../src/views.js';

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

test('roadmap sidebar omits documents marked as hidden', () => {
  const hiddenPath = '03_STRATEGIA_A_POSITIONING/02_SKLAD_ROLUMI_A_OZNAMENIE.md';
  const visiblePath = '03_STRATEGIA_A_POSITIONING/03_OPERACNY_MODEL_ROLUMI.md';
  const html = roadmapPage({
    appName: 'ROLUMI Backstage',
    documents: [
      { path: hiddenPath, section: '03_STRATEGIA_A_POSITIONING', sidebar: false, title: 'Sklad ROLUMI po zrušení maloobchodu' },
      { path: visiblePath, section: '03_STRATEGIA_A_POSITIONING', sidebar: true, title: 'Operačný model skupiny ROLUMI' },
    ],
    timeline: '<div class="roadmap-timeline"></div>',
  });

  assert.doesNotMatch(html, /02_SKLAD_ROLUMI_A_OZNAMENIE/u);
  assert.match(html, /03_OPERACNY_MODEL_ROLUMI/u);
});

test('history opens inside the Backstage shell with one canonical navigation link', () => {
  const historyPath = '01_HISTORIA/HISTORIA_ROLUMI.md';
  const html = historyPage({
    appName: 'ROLUMI Backstage',
    documents: [{ path: historyPath, section: '01_HISTORIA', sidebar: true, title: 'História ROLUMI' }],
    story: '<article class="history-story">Vizuálna história</article>',
  });

  assert.match(html, /class="topbar"/u);
  assert.match(html, /class="sidebar"/u);
  assert.match(html, /main-content--history/u);
  assert.equal((html.match(/href="\/history"/gu) ?? []).length, 1);
  assert.doesNotMatch(html, /\/sections\/01_HISTORIA/u);
  assert.match(html, /side-section-link is-active/u);
  assert.match(html, /<span>01<\/span>História ROLUMI/u);
  assert.match(html, /Vizuálna história/u);
});
