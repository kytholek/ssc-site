#!/usr/bin/env node
/**
 * build.js ? Zero-dependency Markdown-to-HTML blog post generator
 * Usage: node build.js
 * Reads:  content/*.md
 * Writes: blog/{slug}/index.html  (only if .md is newer than existing HTML)
 *         content/posts.json      (metadata index for all generated posts)
 *         blog/index.html         (injects cards between GENERATED markers)
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// â”€â”€â”€ Paths â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ROOT         = __dirname;
const CONTENT_DIR  = path.join(ROOT, 'content');
const BLOG_DIR     = path.join(ROOT, 'blog');
const BLOG_INDEX   = path.join(BLOG_DIR, 'index.html');
const POSTS_JSON   = path.join(CONTENT_DIR, 'posts.json');
const SITE_ORIGIN  = 'https://simulationsourcecode.com';

// â”€â”€â”€ Frontmatter Parser â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function parseFrontmatter(raw) {
  const fm = {};
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: fm, body: raw };

  const metaBlock = match[1];
  const body      = match[2];

  let currentKey = null;
  for (const line of metaBlock.split(/\r?\n/)) {
    // List item: "  - value"
    if (/^\s{2,}- /.test(line)) {
      if (currentKey) {
        if (!Array.isArray(fm[currentKey])) fm[currentKey] = [];
        fm[currentKey].push(line.replace(/^\s+- /, '').trim());
      }
      continue;
    }
    // Key: value
    const kv = line.match(/^(\w[\w-]*)\s*:\s*(.*)/);
    if (kv) {
      currentKey    = kv[1];
      fm[currentKey] = kv[2].trim();
    }
  }

  return { meta: fm, body };
}

// â”€â”€â”€ Markdown ? HTML â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function mdToHtml(md) {
  const lines  = md.split(/\r?\n/);
  const output = [];
  let   inList = false;
  let   inBlockquote = false;

  // Inline transforms
  function inline(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,     '<em>$1</em>')
      .replace(/`(.+?)`/g,       '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  }

  function closeList() {
    if (inList) { output.push('</ul>'); inList = false; }
  }
  function closeBlockquote() {
    if (inBlockquote) { output.push('</blockquote>'); inBlockquote = false; }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Blank line
    if (/^\s*$/.test(line)) {
      closeList();
      closeBlockquote();
      continue;
    }

    // Headings
    if (/^#### /.test(line)) { closeList(); closeBlockquote(); output.push(`<h4>${inline(line.slice(5))}</h4>`); continue; }
    if (/^### /.test(line))  { closeList(); closeBlockquote(); output.push(`<h3>${inline(line.slice(4))}</h3>`); continue; }
    if (/^## /.test(line))   { closeList(); closeBlockquote(); output.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
    if (/^# /.test(line))    { closeList(); closeBlockquote(); output.push(`<h1>${inline(line.slice(2))}</h1>`); continue; }

    // Blockquote
    if (/^> /.test(line)) {
      closeList();
      if (!inBlockquote) { output.push('<blockquote>'); inBlockquote = true; }
      output.push(`<p>${inline(line.slice(2))}</p>`);
      continue;
    }

    // Unordered list
    if (/^- /.test(line)) {
      closeBlockquote();
      if (!inList) { output.push('<ul>'); inList = true; }
      output.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }

    // Paragraph
    closeList();
    closeBlockquote();
    output.push(`<p>${inline(line)}</p>`);
  }

  closeList();
  closeBlockquote();
  return output.join('\n');
}

// â”€â”€â”€ Related Posts HTML â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function buildRelatedPostsHtml(related) {
  if (!related || !related.length) return '';
  const cards = related.map(entry => {
    // Format: "url|Title|Link Text"
    const [href, title, linkText] = entry.split('|');
    return `    <a href="${href}" class="related-post-card">
      <div class="related-post-title">${title}</div>
      <span class="related-post-link">${linkText || 'Read Deep Dive'} ?</span>
    </a>`;
  }).join('\n');

  return `
<div class="related-posts">
  <div class="related-posts-title">Explore More Numbers</div>
  <div class="related-posts-grid">
${cards}
  </div>
</div>`;
}

// â”€â”€â”€ Full Post HTML Template â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function buildPostHtml(meta, bodyHtml, relatedHtml) {
  const slug        = meta.slug;
  const title       = meta.title       || '';
  const description = meta.description || meta.excerpt || '';
  const date        = meta.date        || '2026-01-01';
  const glyph    = meta.glyph   || '?';
  const eyebrow     = meta.eyebrow     || '';
  const ctaText     = meta.cta         || 'The complete blueprint ? including your Expression, Soul Urge, Life Calling, and the compound story behind each number ? is what the Full Blueprint Reading reveals.';
  const breadcrumbName = meta['breadcrumb-name'] || title;
  const canonicalUrl   = `${SITE_ORIGIN}/blog/${slug}/`;
  const fontUrl = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600;700&family=Cormorant+SC:wght@300;400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Simulation Source Code</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${meta.keywords || 'numerology, simulation source code, SSC numerology'}">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="icon" type="image/svg+xml" href="/Images/infinity codex_logo_outline.svg">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="Simulation Source Code">
  <meta property="og:image" content="${SITE_ORIGIN}/Images/ssc-og.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">

  <!-- Article Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${title}",
    "description": "${description}",
    "url": "${canonicalUrl}",
    "datePublished": "${date}",
    "dateModified": "${date}",
    "author": {
      "@type": "Person",
      "name": "Kytholek",
      "url": "${SITE_ORIGIN}"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Simulation Source Code",
      "url": "${SITE_ORIGIN}",
      "logo": {
        "@type": "ImageObject",
        "url": "${SITE_ORIGIN}/Images/Codex Sigil.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${canonicalUrl}"
    }
  }
  </script>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preload" as="style" href="${fontUrl}" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link href="${fontUrl}" rel="stylesheet"></noscript>
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <style>
    /* Standalone post overrides */
    body { padding-top: 64px; }
    .post-wrap { max-width: 740px; margin: 0 auto; padding: 48px 24px 100px; position: relative; z-index: 1; }
    .post-hero { text-align: center; padding: 56px 24px 40px; border-bottom: 1px solid rgba(201,168,76,0.1); margin-bottom: 48px; }
    .post-hero-glyph { font-family: "Cinzel Decorative", serif; font-size: 72px; color: #d0c890; margin-bottom: 16px; display: block; text-shadow: 0 0 60px #d0c89055; }
    .post-hero-eyebrow { font-family: "Cinzel", serif; font-size: 9px; letter-spacing: .4em; text-transform: uppercase; color: var(--gold-dim); margin-bottom: 16px; }
    .post-hero h1 { font-family: "Cormorant SC", serif; font-weight: 300; font-size: clamp(22px, 4vw, 38px); color: var(--gold); line-height: 1.2; margin-bottom: 16px; letter-spacing: .04em; }
    .post-hero-meta { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .25em; text-transform: uppercase; color: var(--text-muted); }
    .post-body h2 { font-family: "Cinzel", serif; font-size: 13px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-light); margin: 44px 0 16px; padding-top: 8px; border-top: 1px solid rgba(201,168,76,0.08); }
    .post-body h3 { font-family: "Cinzel", serif; font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: var(--teal-light); margin: 28px 0 12px; }
    .post-body h4 { font-family: "Cinzel", serif; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--text-muted); margin: 20px 0 10px; }
    .post-body p { font-size: 18px; line-height: 1.9; color: var(--text-dim); margin-bottom: 20px; }
    .post-body p strong { color: var(--text); }
    .post-body ul { margin: 16px 0 20px 0; padding: 0; list-style: none; }
    .post-body ul li { font-size: 17px; line-height: 1.75; color: var(--text-dim); padding: 10px 0 10px 22px; border-bottom: 1px solid rgba(255,255,255,0.04); position: relative; }
    .post-body ul li::before { content: "â—†"; position: absolute; left: 0; top: 11px; font-size: 9px; color: var(--gold-dim); }
    .post-body blockquote { border-left: 2px solid var(--gold-dim); padding: 8px 0 8px 22px; margin: 28px 0; font-size: 19px; font-style: italic; color: var(--text); line-height: 1.75; }
    .post-cta-block { margin-top: 56px; padding: 36px 28px; background: linear-gradient(135deg,rgba(13,11,24,0.9),rgba(24,21,48,0.8)); border: 1px solid rgba(201,168,76,0.2); border-radius: 10px; text-align: center; position: relative; overflow: hidden; }
    .post-cta-block::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent); }
    .post-cta-block p { font-size: 16px; line-height: 1.8; color: var(--text-dim); margin-bottom: 20px; max-width: 520px; margin-left: auto; margin-right: auto; }
    .post-cta-block a { font-family: "Cinzel", serif; font-size: 11px; letter-spacing: .3em; text-transform: uppercase; padding: 16px 32px; border-radius: 5px; cursor: pointer; background: rgba(74,148,148,.25); border: 1px solid rgba(126,200,200,.4); color: var(--teal-light); text-decoration: none; display: inline-block; transition: all .3s; }
    .post-cta-block a:hover { box-shadow: 0 0 32px rgba(74,148,148,.4); transform: translateY(-2px); border-color: rgba(126,200,200,.6); }
    .related-posts { margin-top: 56px; padding-top: 40px; border-top: 1px solid rgba(201,168,76,0.1); }
    .related-posts-title { font-family: "Cinzel", serif; font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: var(--gold); margin-bottom: 28px; }
    .related-posts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .related-post-card { display: block; padding: 20px; border: 1px solid rgba(201,168,76,0.15); border-radius: 8px; text-decoration: none; transition: all .3s; background: transparent; }
    .related-post-card:hover { border-color: rgba(201,168,76,0.35); background: rgba(201,168,76,0.05); transform: translateY(-4px); }
    .related-post-title { font-size: 15px; color: var(--text); margin-bottom: 12px; line-height: 1.4; }
    .related-post-link { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .25em; text-transform: uppercase; color: var(--teal-light); display: inline-block; transition: color .2s; }
    .related-post-card:hover .related-post-link { color: var(--gold); }
    .breadcrumb { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .2em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 32px; display: flex; align-items: center; gap: 10px; }
    .breadcrumb a { color: var(--gold-dim); text-decoration: none; transition: color .2s; }
    .breadcrumb a:hover { color: var(--gold); }
    .breadcrumb span { color: var(--text-muted); }
    @media (max-width: 640px) { .post-hero-glyph { font-size: 52px; } .related-posts-grid { grid-template-columns: 1fr; } }
  </style>

  <!-- BreadcrumbList Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type":"ListItem","position":1,"name":"Home","item":"${SITE_ORIGIN}/"},
      {"@type":"ListItem","position":2,"name":"Blog","item":"${SITE_ORIGIN}/blog/"},
      {"@type":"ListItem","position":3,"name":"${breadcrumbName}","item":"${canonicalUrl}"}
    ]
  }
  </script>
</head>
<body>

<!-- NAV -->
<nav id="main-nav"></nav>

<!-- CONTENT -->
<div class="post-wrap">

  <!-- Breadcrumb -->
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/">Home</a>
    <span>&#8250;</span>
    <a href="/blog/">Blog</a>
    <span>&#8250;</span>
    <span>${breadcrumbName}</span>
  </nav>

  <!-- Hero -->
  <div class="post-hero">
    ${glyph ? `<span class="post-hero-glyph">${glyph}</span>` : ''}
    ${eyebrow ? `<div class="post-hero-eyebrow">${eyebrow}</div>` : ''}
    <h1>${title}</h1>
    <div class="post-hero-meta">By Kytholek &nbsp;&#183;&nbsp; Simulation Source Code</div>
  </div>

  <!-- Body -->
  <div class="post-body">

${bodyHtml}

${relatedHtml}

    <div class="post-cta-block">
      <p>${ctaText}</p>
      <a href="/#calculator" onclick="if(typeof showPage==='function'){showPage('calculator');return false;}">&#11042;&nbsp;Calculate Your Full Blueprint</a>
    </div>

  </div>

</div>

<!-- FOOTER -->
<footer id="main-footer"></footer>
<script src="/js/app.js"></script>
<script>
  if (typeof loadNav === 'function') loadNav();
  if (typeof loadFooter === 'function') loadFooter();
</script>

</body>
</html>
`;
}

// â”€â”€â”€ Blog Index Card HTML â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function buildCardHtml(meta) {
  const slug     = meta.slug;
  const title    = meta.title   || '';
  const excerpt  = meta.excerpt || '';
  const glyph    = meta.glyph   || '?';
  const category = meta.category || 'system';
  const date     = meta.date     ? formatMonthYear(meta.date) : '';

  // Category label ? display text
  const CAT_LABELS = {
    'life-path':   'Life Paths',
    'expression':  'Expressions',
    'soul-urge':   'Soul Urge',
    'system':      'The System',
    'philosophy':  'Philosophy',
    'trinity':     'Trinity Series',
  };
  const catLabel = CAT_LABELS[category] || category;

  return `      <a href="/blog/${slug}/" class="blog-idx-card" data-cat="${category}">
        <div class="blog-idx-card-thumb sys">${glyph}</div>
        <div class="blog-idx-card-body">
          <div class="blog-idx-card-tags"><span class="blog-idx-tag gold">${catLabel}</span><span class="blog-idx-date">${date}</span></div>
          <div class="blog-idx-card-title">${title}</div>
          <p class="blog-idx-card-excerpt">${excerpt}</p>
          <span class="blog-idx-read">Read Article ?</span>
        </div>
      </a>`;
}

function formatMonthYear(dateStr) {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const d = new Date(dateStr + 'T00:00:00');
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// â”€â”€â”€ Blog Index Updater â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const START_MARKER = '<!-- GENERATED_POSTS_START -->';
const END_MARKER   = '<!-- GENERATED_POSTS_END -->';

function updateBlogIndex(posts) {
  if (!fs.existsSync(BLOG_INDEX)) {
    console.warn('[build] blog/index.html not found ? skipping index update');
    return;
  }

  let html = fs.readFileSync(BLOG_INDEX, 'utf8');

  const startIdx = html.indexOf(START_MARKER);
  const endIdx   = html.indexOf(END_MARKER);
  if (startIdx === -1 || endIdx === -1) {
    console.warn('[build] Markers not found in blog/index.html ? skipping index update');
    console.warn('        Add <!-- GENERATED_POSTS_START --> and <!-- GENERATED_POSTS_END --> to blog/index.html');
    return;
  }

  // Sort by date descending
  const sorted = [...posts].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const cards  = sorted.map(buildCardHtml).join('\n');

  const before = html.slice(0, startIdx + START_MARKER.length);
  const after  = html.slice(endIdx);

  let updated = before + '\n' + cards + '\n      ' + after;

  // Show/hide generated section based on whether there are posts
  updated = updated.replace(
    /(<div class="blog-idx-section" id="section-generated") style="display:none"/,
    '$1'
  );

  fs.writeFileSync(BLOG_INDEX, updated, 'utf8');
  console.log(`[build] blog/index.html updated with ${posts.length} generated post(s)`);
}

// â”€â”€â”€ Main â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error('[build] content/ directory not found. Create it and add .md files.');
    process.exit(1);
  }

  const mdFiles = fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.md') && f !== 'README.md');

  if (!mdFiles.length) {
    console.log('[build] No .md files found in content/. Nothing to do.');
    return;
  }

  const allMeta = [];
  let   built   = 0;
  let   skipped = 0;

  for (const file of mdFiles) {
    const srcPath = path.join(CONTENT_DIR, file);
    const raw     = fs.readFileSync(srcPath, 'utf8');
    const { meta, body } = parseFrontmatter(raw);

    // Allow content files to be kept in-repo but excluded from generation.
    if (String(meta.draft || '').toLowerCase() === 'true') {
      skipped++;
      continue;
    }

    if (!meta.slug) {
      console.warn(`[build] ${file}: missing 'slug' in frontmatter ? skipping`);
      continue;
    }

    const outDir  = path.join(BLOG_DIR, meta.slug);
    const outFile = path.join(outDir, 'index.html');

    // Skip if HTML is newer than .md (unless --force flag)
    const force = process.argv.includes('--force');
    if (!force && fs.existsSync(outFile)) {
      const srcMtime = fs.statSync(srcPath).mtimeMs;
      const outMtime = fs.statSync(outFile).mtimeMs;
      if (outMtime >= srcMtime) {
        skipped++;
        allMeta.push(meta);
        continue;
      }
    }

    const bodyHtml    = mdToHtml(body);
    const relatedHtml = buildRelatedPostsHtml(meta.related);
    const html        = buildPostHtml(meta, bodyHtml, relatedHtml);

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, html, 'utf8');
    console.log(`[build] Generated: blog/${meta.slug}/index.html`);
    built++;
    allMeta.push(meta);
  }

  // Write posts.json
  fs.writeFileSync(POSTS_JSON, JSON.stringify(allMeta, null, 2), 'utf8');
  console.log(`[build] content/posts.json updated (${allMeta.length} posts)`);

  // Update blog/index.html
  if (allMeta.length) updateBlogIndex(allMeta);

  console.log(`[build] Done ? ${built} built, ${skipped} unchanged`);
}

main();

