import { encodePath, HISTORY_MARKDOWN_PATH, sections } from './content.js';

const brandNavigation = [
  { path: 'brand/guidelines', href: '/brand/guidelines', label: 'Brand guidelines' },
  { path: 'brand/design-system', href: '/brand/design-system', label: 'Design system' },
  { path: 'brand/social-networks', href: '/brand/social-networks', label: 'Social networks' },
];

const brandLogos = [
  {
    background: 'light',
    description: 'Predvolená verzia na biele a veľmi svetlé pozadie.',
    filename: 'Rolumi_logo.svg',
    title: 'Primárne farebné logo',
  },
  {
    background: 'dark',
    description: 'Predvolená verzia na grafitové a veľmi tmavé pozadie.',
    filename: 'Rolumi_logo_white_yellowSymbol.svg',
    title: 'Biele logo so žltým symbolom',
  },
  {
    background: 'yellow',
    description: 'Jednofarebná brandová verzia s najvyšším kontrastom na žltej.',
    filename: 'Rolumi_logo_black(Brand).svg',
    title: 'Grafitové logo',
  },
  {
    background: 'yellow',
    description: 'Alternatíva pre veľký formát na žltom pozadí.',
    filename: 'Rolumi_logo_white_blackSymbol.svg',
    title: 'Biele logo s grafitovým symbolom',
  },
  {
    background: 'dark',
    description: 'Jednofarebná verzia na tmavé plochy alebo pokojnú fotografiu.',
    filename: 'Rolumi_logo_white.svg',
    title: 'Biele logo',
  },
  {
    background: 'dark',
    description: 'Žltá jednofarebná verzia na tmavé pozadie.',
    filename: 'Rolumi_logo_yellow.svg',
    title: 'Žlté logo',
  },
  {
    background: 'light',
    description: 'Iba pre technickú čiernobielu tlač bez brandovej grafitovej.',
    filename: 'Rolumi_logo_black.svg',
    title: 'Technické čierne logo',
  },
];

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function documentNavigation(documents, currentPath = '') {
  return sections.map((section) => {
    if (section.folder === '01_HISTORIA') {
      return `
        <li class="side-section">
          <a class="side-section-link${currentPath === HISTORY_MARKDOWN_PATH ? ' is-active' : ''}" href="/history">
            <span>${section.number}</span>História ROLUMI
          </a>
        </li>
      `;
    }

    if (section.folder === '02_BRAND') {
      const links = brandNavigation.map((item) => `
        <li>
          <a class="side-document${item.path === currentPath ? ' is-active' : ''}" href="${item.href}">
            ${item.label}
          </a>
        </li>
      `).join('');

      return `
        <li class="side-section">
          <a class="side-section-link${currentPath.startsWith('brand/') ? ' is-active' : ''}" href="/brand/guidelines">
            <span>${section.number}</span>${escapeHtml(section.label)}
          </a>
          <ul>${links}</ul>
        </li>
      `;
    }

    const items = documents.filter((document) => document.section === section.folder && document.sidebar !== false);
    const documentLinks = items.map((document) => `
      <li>
        <a class="side-document${document.path === currentPath ? ' is-active' : ''}"
           href="${document.path === HISTORY_MARKDOWN_PATH ? '/history' : `/docs/${encodePath(document.path)}`}">
          ${escapeHtml(document.title)}
        </a>
      </li>
    `).join('');

    return `
      <li class="side-section">
        <a class="side-section-link" href="/sections/${encodeURIComponent(section.folder)}">
          <span>${section.number}</span>${escapeHtml(section.label)}
        </a>
        ${documentLinks ? `<ul>${documentLinks}</ul>` : ''}
      </li>
    `;
  }).join('');
}

function shell({ appName, content, currentPath, documents, mainClass = '', title }) {
  return `<!doctype html>
  <html lang="sk">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="robots" content="noindex,nofollow">
      <title>${escapeHtml(title)} · ${escapeHtml(appName)}</title>
      <link rel="stylesheet" href="/assets/styles.css">
      <script src="/assets/app.js" defer></script>
    </head>
    <body class="app-body">
      <a class="skip-link" href="#main">Preskočiť na obsah</a>
      <header class="topbar">
        <button class="menu-button" type="button" data-menu-toggle aria-expanded="false" aria-controls="sidebar">
          <span class="sr-only">Otvoriť navigáciu</span>
          <span></span><span></span><span></span>
        </button>
        <a class="brand-lockup" href="/roadmap" aria-label="ROLUMI Backstage: roadmap">
          <img src="/assets/rolumi-logo.svg" alt="ROLUMI STAVEBNINY">
          <span>Backstage</span>
        </a>
        <div class="topbar-actions">
          <form class="search-form" action="/search" method="get" role="search">
            <label class="sr-only" for="search">Hľadať v dokumentoch</label>
            <input id="search" name="q" type="search" placeholder="Hľadať…" autocomplete="off">
            <button type="submit">Hľadať</button>
          </form>
          <form action="/logout" method="post">
            <button class="text-button" type="submit">Odhlásiť</button>
          </form>
        </div>
      </header>
      <div class="app-grid">
        <aside class="sidebar" id="sidebar" data-sidebar>
          <nav aria-label="Hlavná navigácia">
            <a class="roadmap-link roadmap-link--primary${currentPath === 'ROADMAP.md' ? ' is-active' : ''}" href="/roadmap">
              <span>00</span> Roadmap
            </a>
            <a class="roadmap-link" href="/search">
              <span>⌕</span> Hľadať
            </a>
            <ol class="side-sections">${documentNavigation(documents, currentPath)}</ol>
          </nav>
          <p class="sidebar-note">Interný pracovný priestor<br>Obsah podľa posledného publikovaného snapshotu</p>
        </aside>
        <div class="sidebar-scrim" data-menu-toggle aria-hidden="true"></div>
        <main id="main" class="main-content${mainClass ? ` ${mainClass}` : ''}">${content}</main>
      </div>
    </body>
  </html>`;
}

export function loginPage({ appName, error = '', siteKey = '', turnstileRequired = false }) {
  const turnstile = turnstileRequired ? `
    <div class="turnstile-wrap">
      <div class="cf-turnstile" data-sitekey="${escapeHtml(siteKey)}" data-action="login" data-theme="light"></div>
    </div>
  ` : '<p class="local-note">Lokálne overenie proti botom je vypnuté.</p>';

  return `<!doctype html>
  <html lang="sk">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="robots" content="noindex,nofollow">
      <title>Prihlásenie · ${escapeHtml(appName)}</title>
      <link rel="stylesheet" href="/assets/styles.css">
      ${turnstileRequired ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : ''}
    </head>
    <body class="login-body">
      <main class="login-shell">
        <section class="login-brand" aria-label="ROLUMI Backstage">
          <img src="/assets/rolumi-logo-inverse.svg" alt="ROLUMI STAVEBNINY">
          <div>
            <p class="eyebrow inverse">Interný pracovný priestor</p>
            <h1>Miesto, kde je smer firmy na jednom mieste.</h1>
            <p>Roadmapa, rozhodnutia a pracovné dokumenty ROLUMI v čitateľnej podobe.</p>
          </div>
          <span class="brand-line" aria-hidden="true"></span>
        </section>
        <section class="login-panel">
          <div class="login-form-wrap">
            <p class="eyebrow">ROLUMI Backstage</p>
            <h2>Prihlásenie</h2>
            <p class="form-intro">Priestor je určený iba pre pozvaných členov tímu.</p>
            ${error ? `<div class="form-error" role="alert">${escapeHtml(error)}</div>` : ''}
            <form action="/login" method="post" class="login-form">
              <div class="field">
                <label for="username">Meno</label>
                <input id="username" name="username" type="text" autocomplete="username" required autofocus>
              </div>
              <div class="field">
                <label for="password">Heslo</label>
                <input id="password" name="password" type="password" autocomplete="current-password" required>
              </div>
              ${turnstile}
              <button class="primary-button" type="submit">Vstúpiť do Backstage <span aria-hidden="true">→</span></button>
            </form>
          </div>
        </section>
      </main>
    </body>
  </html>`;
}

export function roadmapPage({ appName, documents, timeline }) {
  const content = `
    <section class="roadmap-manifesto" aria-labelledby="roadmap-title">
      <div class="roadmap-manifesto-copy">
        <p class="roadmap-manifesto-kicker">ROLUMI 2030</p>
        <h1 id="roadmap-title">Staviame na 20 rokoch skúseností. <span>Spoločne tvoríme nové ROLUMI.</span></h1>
        <p class="roadmap-manifesto-lede">Z tradičného maloobchodu sa meníme na strategického partnera pre celú stavbu. Zákazníkom tak prinášame istotu od výberu materiálu až po úspešnú realizáciu.</p>
      </div>
      <div class="roadmap-manifesto-year" aria-hidden="true"><span>20</span><span>30</span></div>
    </section>
    ${timeline}
  `;
  return shell({
    appName,
    content,
    currentPath: 'ROADMAP.md',
    documents,
    mainClass: 'main-content--roadmap',
    title: 'Roadmap',
  });
}

export function historyPage({ appName, documents, story }) {
  return shell({
    appName,
    content: story,
    currentPath: HISTORY_MARKDOWN_PATH,
    documents,
    mainClass: 'main-content--history',
    title: 'História ROLUMI',
  });
}

function brandPageHeader({ accent, aside = '', description, eyebrow, id, title }) {
  return `
    <section class="brand-page-header" aria-labelledby="${escapeHtml(id)}">
      <div class="brand-page-wrap brand-page-header-inner${aside ? ' brand-page-header-inner--with-aside' : ''}">
        <div class="brand-page-header-copy">
          <p class="eyebrow inverse">${escapeHtml(eyebrow)}</p>
          <h1 id="${escapeHtml(id)}">${escapeHtml(title)}<br><span>${escapeHtml(accent)}</span></h1>
          <p>${escapeHtml(description)}</p>
        </div>
        ${aside}
      </div>
    </section>
  `;
}

export function brandGuidelinesPage({ appName, documents }) {
  const logos = brandLogos.map((logo) => {
    const encodedFilename = encodeURIComponent(logo.filename);
    const pngFilename = logo.filename.replace(/\.svg$/u, '.png');
    const encodedPngFilename = encodeURIComponent(pngFilename);
    const source = `/content/02_BRAND/${encodedFilename}`;
    const svgDownload = `/brand/download/${encodedFilename}`;
    const pngDownload = `/brand/download/${encodedPngFilename}`;
    return `
      <article class="brand-logo-card">
        <div class="brand-logo-preview brand-logo-preview--${logo.background}">
          <img src="${source}" alt="${escapeHtml(logo.title)}">
        </div>
        <div class="brand-logo-copy">
          <p class="brand-logo-type">SVG + transparentné PNG · 2400 px</p>
          <h3>${escapeHtml(logo.title)}</h3>
          <p>${escapeHtml(logo.description)}</p>
          <div class="download-links">
            <a class="download-link" href="${svgDownload}">Stiahnuť SVG <span aria-hidden="true">↓</span></a>
            <a class="download-link download-link--png" href="${pngDownload}">Stiahnuť PNG <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  const manualLink = `
    <a class="brand-manual-link" href="/brand/download/Rolumi_brandmanual_new.pdf">
      <span>Pôvodný podklad</span>
      <strong>Stiahnuť brand manuál</strong>
      <b aria-hidden="true">↓</b>
    </a>
  `;
  const content = `
    ${brandPageHeader({
      accent: 'Správne použitie.',
      aside: manualLink,
      description: 'Praktický základ pre prácu s logom, farbami a typografiou ROLUMI. Všetky logá na tejto stránke sú schválené zdrojové SVG súbory.',
      eyebrow: 'Brand guidelines',
      id: 'brand-guidelines-title',
      title: 'Jedna značka.',
    })}
    <section class="brand-guideline-section">
      <div class="brand-guidelines-wrap">
        <div class="brand-guideline-heading">
          <p class="eyebrow">01 / Základ</p>
          <h2>Pevnosť, jasnosť a kontrast.</h2>
          <p>ROLUMI stojí na grafitovej, žltej a bielej. Inter drží komunikáciu priamu a súčasnú. Žltá je funkčný signál, nie výplň každého prvku.</p>
        </div>
        <div class="brand-foundations-grid">
          <article class="brand-color-card brand-color-card--ink"><strong>Grafitová</strong><code>#1D1E1F</code></article>
          <article class="brand-color-card brand-color-card--yellow"><strong>Žltá</strong><code>#F9B62B</code></article>
          <article class="brand-color-card brand-color-card--white"><strong>Biela</strong><code>#FFFFFF</code></article>
          <article class="brand-type-card">
            <span>Primárne písmo</span>
            <strong>Inter</strong>
            <p>ExtraBold 800 pre nadpisy.<br>Regular 400 pre bežný text.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="brand-guideline-section brand-guideline-section--logos">
      <div class="brand-guidelines-wrap">
        <div class="brand-guideline-heading">
          <p class="eyebrow">02 / Logá na stiahnutie</p>
          <h2>Variant vyberá pozadie.</h2>
          <p>Logo neupravujte, neotáčajte, nenaťahujte ani neskladajte nanovo. Zachovajte okolo neho voľný priestor minimálne vo veľkosti samostatného symbolu.</p>
        </div>
        <div class="brand-logo-grid">${logos}</div>
      </div>
    </section>

    <section class="brand-rules-panel">
      <div class="brand-guidelines-wrap brand-rules-panel-inner">
        <div>
          <p class="eyebrow inverse">03 / Rýchla kontrola</p>
          <h2>Pred použitím loga.</h2>
        </div>
        <ol>
          <li><span>01</span>Vyberte variant podľa pozadia.</li>
          <li><span>02</span>Zachovajte proporcie a ochrannú zónu.</li>
          <li><span>03</span>Nepoužívajte tieň, obrys ani priehľadnosť.</li>
          <li><span>04</span>Na fotografii použite biele logo iba na pokojnej tmavej ploche.</li>
        </ol>
      </div>
    </section>
  `;

  return shell({
    appName,
    content,
    currentPath: 'brand/guidelines',
    documents,
    mainClass: 'main-content--brand-guidelines',
    title: 'Brand guidelines',
  });
}

export function designSystemPage({ appName, catalog, documents }) {
  const header = brandPageHeader({
    accent: 'reálnu prácu.',
    description: 'Kontrastná identita postavená na grafitovej, žltej, výraznej typografii a autentickom obraze stavebníctva.',
    eyebrow: 'Design system',
    id: 'design-system-title',
    title: 'Pevná značka pre',
  });
  return shell({
    appName,
    content: `${header}<div class="design-system-catalog" aria-label="ROLUMI Design system">${catalog}</div>`,
    currentPath: 'brand/design-system',
    documents,
    mainClass: 'main-content--brand-catalog',
    title: 'Design system',
  });
}

export function socialNetworksPage({ appName, catalog, documents }) {
  const header = brandPageHeader({
    accent: 'bez vizuálneho šumu.',
    description: 'Jedna jasná myšlienka na formát. Fotografia, pevná typografia a žltá ako funkčný signál, bez oválnych prvkov.',
    eyebrow: 'Social networks',
    id: 'social-networks-title',
    title: 'Social media',
  });
  return shell({
    appName,
    content: `${header}<div class="social-networks-catalog" aria-label="ROLUMI Social networks">${catalog}</div>`,
    currentPath: 'brand/social-networks',
    documents,
    mainClass: 'main-content--brand-catalog',
    title: 'Social networks',
  });
}

export function documentPage({ appName, currentPath, documents, html, title }) {
  const section = sections.find((item) => currentPath.startsWith(`${item.folder}/`));
  const content = `
    <div class="breadcrumbs">
      <a href="/roadmap">Roadmap</a><span>/</span>
      ${section ? `<a href="/sections/${encodeURIComponent(section.folder)}">${escapeHtml(section.label)}</a><span>/</span>` : ''}
      <span>${escapeHtml(title)}</span>
    </div>
    <article class="markdown-card document-card">
      <div class="article-label">${escapeHtml(currentPath)}</div>
      <div class="markdown-body">${html}</div>
    </article>
  `;
  return shell({ appName, content, currentPath, documents, title });
}

export function sectionPage({ appName, documents, section }) {
  const sectionDocuments = documents.filter((document) => document.section === section.folder);
  const cards = sectionDocuments.length > 0
    ? sectionDocuments.map((document, index) => `
      <a class="document-tile" href="${document.path === HISTORY_MARKDOWN_PATH ? '/history' : `/docs/${encodePath(document.path)}`}">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <h2>${escapeHtml(document.title)}</h2>
        <p>${escapeHtml(document.path)}</p>
        <b aria-hidden="true">→</b>
      </a>
    `).join('')
    : `<div class="empty-state">
        <p class="eyebrow">Zatiaľ bez dokumentov</p>
        <h2>Táto časť vznikne, keď na ňu príde rad.</h2>
        <p>Backstage zámerne nevytvára prázdne dokumenty ani predčasne detailné plány.</p>
      </div>`;

  const content = `
    <section class="page-hero section-hero">
      <div>
        <p class="eyebrow">${section.number} / Roadmap</p>
        <h1>${escapeHtml(section.label)}</h1>
        <p class="hero-copy">${escapeHtml(section.summary)}</p>
      </div>
      <div class="section-count"><strong>${sectionDocuments.length}</strong><span>dokumentov</span></div>
    </section>
    <section class="document-grid">${cards}</section>
  `;
  return shell({ appName, content, currentPath: '', documents, title: section.label });
}

export function searchPage({ appName, documents, query, results }) {
  const content = `
    <section class="page-hero compact-hero">
      <div>
        <p class="eyebrow">Vyhľadávanie</p>
        <h1>${query ? `Výsledky pre „${escapeHtml(query)}“` : 'Hľadať v Backstage'}</h1>
        <p class="hero-copy">${query ? `${results.length} nájdených dokumentov.` : 'Zadajte názov alebo výraz z dokumentu.'}</p>
      </div>
    </section>
    <form class="page-search" action="/search" method="get" role="search">
      <label for="page-search">Hľadaný výraz</label>
      <div><input id="page-search" name="q" value="${escapeHtml(query)}" type="search" required><button type="submit">Hľadať</button></div>
    </form>
    <section class="search-results">
      ${results.map((result) => `
        <a href="${result.path === HISTORY_MARKDOWN_PATH ? '/history' : `/docs/${encodePath(result.path)}`}">
          <span>${escapeHtml(result.path)}</span>
          <h2>${escapeHtml(result.title)}</h2>
          <p>${escapeHtml(result.excerpt)}</p>
        </a>
      `).join('') || (query ? '<p class="empty-search">Nenašli sa žiadne dokumenty. Skúste kratší alebo všeobecnejší výraz.</p>' : '')}
    </section>
  `;
  return shell({ appName, content, currentPath: '', documents, title: 'Vyhľadávanie' });
}

export function notFoundPage({ appName, documents }) {
  const content = `
    <section class="not-found">
      <p class="eyebrow">404</p>
      <h1>Táto stránka v Backstage nie je.</h1>
      <p>Obsah mohol byť presunutý alebo ešte nebol publikovaný.</p>
      <a class="primary-button" href="/roadmap">Späť na roadmapu <span aria-hidden="true">→</span></a>
    </section>
  `;
  return shell({ appName, content, currentPath: '', documents, title: 'Stránka sa nenašla' });
}
