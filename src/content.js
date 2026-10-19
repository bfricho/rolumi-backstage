import fs from 'node:fs/promises';
import path from 'node:path';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

export const sections = [
  { folder: '01_HISTORIA', label: 'História', number: '01', summary: 'Príbeh, vývoj a dôležité míľniky spoločnosti.' },
  { folder: '02_BRAND', label: 'Brand', number: '02', summary: 'Identita, pravidlá značky a digitálny design systém.' },
  { folder: '03_STRATEGIA_A_POSITIONING', label: 'Stratégia a positioning', number: '03', summary: 'Budúci smer, areál, sklad a operačný model skupiny.' },
  { folder: '04_WEB', label: 'Web', number: '04', summary: 'Nový web a verejná komunikácia transformácie.' },
  { folder: '05_MARKETING', label: 'Marketing', number: '05', summary: 'Povedomie, dôvera a rozvoj dopytu.' },
  { folder: '06_OBCHOD', label: 'Obchod', number: '06', summary: 'Premena ponuky na zákazky a tržby.' },
];

const visibleDocumentsBySection = new Map([
  ['02_BRAND', new Set([
    '02_BRAND/BRAND_AUDIT.md',
    '02_BRAND/Design System/README.md',
    '02_BRAND/TODO.md',
  ])],
]);

const hiddenSidebarDocuments = new Set([
  '03_STRATEGIA_A_POSITIONING/02_SKLAD_ROLUMI_A_OZNAMENIE.md',
]);

const allowedTags = [
  ...sanitizeHtml.defaults.allowedTags,
  'details', 'summary', 'figure', 'figcaption', 'mark', 's', 'input',
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function encodePath(value) {
  return value.split('/').map(encodeURIComponent).join('/');
}

export function safeContentPath(root, relativePath) {
  if (
    typeof relativePath !== 'string'
    || relativePath.includes('\0')
    || path.posix.isAbsolute(relativePath)
    || relativePath.split('/').includes('..')
  ) {
    throw new Error('Invalid content path');
  }
  const normalized = path.posix.normalize(`/${relativePath}`).slice(1);
  const absolute = path.resolve(root, normalized);
  const prefix = `${path.resolve(root)}${path.sep}`;
  if (absolute !== path.resolve(root) && !absolute.startsWith(prefix)) {
    throw new Error('Invalid content path');
  }
  return absolute;
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'section';
}

function titleFromMarkdown(source, fallback) {
  const match = source.match(/^#\s+(.+)$/m);
  return match ? match[1].replace(/[*_`]/g, '').trim() : fallback;
}

async function walk(root, directory = '') {
  const entries = await fs.readdir(path.join(root, directory), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const relative = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(root, relative));
    else files.push(relative);
  }
  return files;
}

export async function loadContentIndex(root) {
  const allFiles = await walk(root);
  const documents = [];
  for (const relativePath of allFiles.filter((file) => file.toLowerCase().endsWith('.md'))) {
    const section = relativePath.includes('/') ? relativePath.split('/')[0] : 'ROADMAP';
    const visibleDocuments = visibleDocumentsBySection.get(section);
    if (visibleDocuments && !visibleDocuments.has(relativePath)) continue;
    const source = await fs.readFile(safeContentPath(root, relativePath), 'utf8');
    documents.push({
      path: relativePath,
      section,
      sidebar: !hiddenSidebarDocuments.has(relativePath),
      title: titleFromMarkdown(source, path.basename(relativePath, '.md').replaceAll('_', ' ')),
    });
  }
  documents.sort((left, right) => left.path.localeCompare(right.path, 'sk'));
  return { allFiles: new Set(allFiles), documents };
}

function resolveLink(href, currentPath) {
  if (!href || href.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) return href;
  const [pathname, suffix = ''] = href.split(/(?=[?#])/u, 2);
  const decodedPath = decodeURIComponent(pathname);
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(currentPath), decodedPath));
  const route = resolved.toLowerCase().endsWith('.md') ? '/docs/' : '/content/';
  return `${route}${encodePath(resolved)}${suffix}`;
}

export function renderRoadmapHtml(source) {
  const withResources = source.replace(/\b(src|href)="([^"]+)"/gu, (match, attribute, value) => {
    if (value.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//')) return match;
    return `${attribute}="${resolveLink(value, 'ROADMAP.html')}"`;
  });

  return withResources.replace(/url\((['"]?)([^)'"\s]+)\1\)/gu, (match, quote, value) => {
    if (value.startsWith('/') || value.startsWith('data:') || /^[a-z][a-z0-9+.-]*:/i.test(value)) return match;
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname('ROADMAP.html'), decodeURIComponent(value)));
    return `url(${quote}/content/${encodePath(resolved)}${quote})`;
  });
}

export function renderRoadmapTimeline(source) {
  const rendered = renderRoadmapHtml(source);
  const timeline = rendered.match(/<main\s+id="roadmapa"\s+class="timeline"\s+aria-label="([^"]+)">([\s\S]*?)<\/main>/u);
  if (!timeline) throw new Error('Roadmap timeline is missing');

  return `<div class="roadmap-timeline" role="region" aria-label="${timeline[1]}">${timeline[2]}</div>`;
}

export function renderMarkdown(source, currentPath) {
  const md = new MarkdownIt({ breaks: false, html: false, linkify: true, typographer: true });
  const slugs = new Map();

  md.renderer.rules.heading_open = (tokens, index, options, env, renderer) => {
    const inline = tokens[index + 1];
    const raw = inline?.type === 'inline' ? inline.content : 'section';
    const base = slugify(raw);
    const count = slugs.get(base) ?? 0;
    slugs.set(base, count + 1);
    tokens[index].attrSet('id', count === 0 ? base : `${base}-${count + 1}`);
    return renderer.renderToken(tokens, index, options);
  };

  const defaultLinkOpen = md.renderer.rules.link_open
    ?? ((tokens, index, options, env, renderer) => renderer.renderToken(tokens, index, options));
  md.renderer.rules.link_open = (tokens, index, options, env, renderer) => {
    const hrefIndex = tokens[index].attrIndex('href');
    if (hrefIndex >= 0) {
      const original = tokens[index].attrs[hrefIndex][1];
      const resolved = resolveLink(original, currentPath);
      tokens[index].attrs[hrefIndex][1] = resolved;
      if (/^https?:/i.test(resolved)) {
        tokens[index].attrSet('target', '_blank');
        tokens[index].attrSet('rel', 'noreferrer noopener');
      }
    }
    return defaultLinkOpen(tokens, index, options, env, renderer);
  };

  const rendered = md.render(source);
  return sanitizeHtml(rendered, {
    allowedAttributes: {
      a: ['href', 'rel', 'target'],
      code: ['class'],
      h1: ['id'], h2: ['id'], h3: ['id'], h4: ['id'], h5: ['id'], h6: ['id'],
      input: ['checked', 'disabled', 'type'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedTags,
  });
}

export function makeExcerpt(source, query, length = 180) {
  const plain = source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`\[\]()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const match = plain.search(new RegExp(escapeRegExp(query), 'i'));
  const start = Math.max(0, match < 0 ? 0 : match - 60);
  const excerpt = plain.slice(start, start + length);
  return `${start > 0 ? '…' : ''}${excerpt}${start + length < plain.length ? '…' : ''}`;
}
