import assert from 'node:assert/strict';
import test from 'node:test';
import {
  brandGuidelinesPage,
  designSystemPage,
  historyPage,
  roadmapPage,
  socialNetworksPage,
} from '../src/views.js';

test('roadmap opens with the ROLUMI 2030 transformation headline', () => {
  const html = roadmapPage({
    appName: 'ROLUMI Backstage',
    documents: [],
    timeline: '<div class="roadmap-timeline"></div>',
  });

  assert.match(html, /ROLUMI 2030/u);
  assert.match(html, /Staviame na 20 rokoch skúseností\./u);
  assert.match(html, /Spoločne tvoríme nové ROLUMI\./u);
  assert.match(html, /roadmap-link roadmap-link--primary is-active/u);
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

test('Brand navigation contains three native pages and no Markdown documents', () => {
  const html = roadmapPage({
    appName: 'ROLUMI Backstage',
    documents: [
      { path: '02_BRAND/BRAND_AUDIT.md', section: '02_BRAND', sidebar: true, title: 'Audit' },
    ],
    timeline: '<div class="roadmap-timeline"></div>',
  });

  assert.match(html, /href="\/brand\/guidelines"[^>]*>\s*Brand guidelines/u);
  assert.match(html, /href="\/brand\/design-system"[^>]*>\s*Design system/u);
  assert.match(html, /href="\/brand\/social-networks"[^>]*>\s*Social networks/u);
  assert.doesNotMatch(html, /BRAND_AUDIT|\/docs\/02_BRAND/u);
});

test('Brand guidelines exposes every approved logo as an individual download', () => {
  const html = brandGuidelinesPage({ appName: 'ROLUMI Backstage', documents: [] });

  assert.match(html, /Jedna značka\./u);
  assert.match(html, /href="\/brand\/download\/Rolumi_logo\.svg"/u);
  assert.match(html, /href="\/brand\/download\/Rolumi_logo_white_yellowSymbol\.svg"/u);
  assert.match(html, /href="\/brand\/download\/Rolumi_logo_white_yellowSymbol\.png"/u);
  assert.match(html, /href="\/brand\/download\/Rolumi_logo_black\(Brand\)\.svg"/u);
  assert.match(html, /href="\/brand\/download\/Rolumi_logo_black\(Brand\)\.png"/u);
  assert.match(html, /href="\/brand\/download\/Rolumi_brandmanual_new\.pdf"/u);
  assert.match(html, /brand-page-wrap brand-page-header-inner brand-page-header-inner--with-aside/u);
  assert.match(html, /brand-guidelines-wrap brand-rules-panel-inner/u);
  assert.equal((html.match(/Stiahnuť SVG/gu) ?? []).length, 7);
  assert.equal((html.match(/Stiahnuť PNG/gu) ?? []).length, 7);
  assert.doesNotMatch(html, /[—–]/u);
});

test('Brand catalogs render inside the shared Backstage shell', () => {
  const design = designSystemPage({ appName: 'ROLUMI Backstage', catalog: '<section>Design</section>', documents: [] });
  const social = socialNetworksPage({ appName: 'ROLUMI Backstage', catalog: '<section>Social</section>', documents: [] });

  for (const html of [design, social]) {
    assert.match(html, /class="topbar"/u);
    assert.match(html, /class="sidebar"/u);
    assert.match(html, /main-content--brand-catalog/u);
  }
  assert.match(design, /side-document is-active" href="\/brand\/design-system"/u);
  assert.match(social, /side-document is-active" href="\/brand\/social-networks"/u);
  assert.match(design, /<p class="eyebrow inverse">Design system<\/p>/u);
  assert.match(social, /<p class="eyebrow inverse">Social networks<\/p>/u);
  assert.equal((design.match(/brand-page-header/g) ?? []).length > 0, true);
  assert.equal((social.match(/brand-page-header/g) ?? []).length > 0, true);
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
