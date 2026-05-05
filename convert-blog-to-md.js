#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const BLOG_DIR = path.join(ROOT, 'blog');
const CONTENT_DIR = path.join(ROOT, 'content');

const KEEP_HTML = new Set([
  '3-6-9-pattern-tesla-numerology',
  'evolution-of-energy-0-through-9',
  'five-lenses-of-self-ego-mind-soul-spirit-void',
  'infinity-loop-cycles-recursion-numerology',
  'trinity-of-purpose-numerology',
  'trinity-of-expression-numerology',
  'trinity-of-lessons-numerology',
  'decoding-matrix'
]);

function decodeEntities(str) {
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8250;/g, '>')
    .replace(/&#11042;/g, '')
    .replace(/&#183;/g, 'Â·')
    .replace(/&middot;/g, 'Â·')
    .replace(/&#8212;/g, 'â€”')
    .replace(/&mdash;/g, 'â€”')
    .replace(/&ndash;/g, 'â€“')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}

function inlineMd(s) {
  let t = s;
  t = t.replace(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => `[${stripTags(label)}](${href})`);
  t = t.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  t = t.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  t = t.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');
  t = t.replace(/<br\s*\/?\s*>/gi, ' ');
  t = t.replace(/<[^>]+>/g, '');
  return decodeEntities(t).replace(/\s+/g, ' ').trim();
}

function htmlToMarkdown(bodyHtml) {
  let out = bodyHtml;

  out = out.replace(/\r/g, '');
  out = out.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n## ${stripTags(t)}\n`);
  out = out.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n### ${stripTags(t)}\n`);
  out = out.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `\n#### ${stripTags(t)}\n`);

  out = out.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
    const ps = [...inner.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m => `> ${inlineMd(m[1])}`);
    return `\n${ps.join('\n')}\n`;
  });

  out = out.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
    const lis = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m => `- ${inlineMd(m[1])}`);
    return `\n${lis.join('\n')}\n`;
  });

  out = out.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => `\n${inlineMd(t)}\n`);

  out = out.replace(/<[^>]+>/g, '');
  out = decodeEntities(out);
  out = out.replace(/\n{3,}/g, '\n\n').trim();
  return out;
}

function parsePost(html, slug) {
  const title = html.match(/<h1>([\s\S]*?)<\/h1>/i)?.[1] || '';
  const desc = html.match(/<meta name="description" content="([\s\S]*?)">/i)?.[1] || '';
  const keywords = html.match(/<meta name="keywords" content="([\s\S]*?)">/i)?.[1] || '';
  const date = html.match(/"datePublished":\s*"([0-9-]+)"/i)?.[1] || '';
  const glyph = html.match(/post-hero-glyph">([\s\S]*?)<\/span>/i)?.[1] || '';
  const eyebrow = html.match(/post-hero-eyebrow">([\s\S]*?)<\/div>/i)?.[1] || '';
  const breadcrumb = html.match(/<nav class="breadcrumb"[\s\S]*?<span>([^<]+)<\/span>\s*<\/nav>/i)?.[1] || '';
  const cta = html.match(/<div class="post-cta-block">[\s\S]*?<p>([\s\S]*?)<\/p>/i)?.[1] || '';

  const relatedBlock = html.match(/<div class="related-posts">([\s\S]*?)<\/div>\s*<\/div>\s*<div class="post-cta-block">/i)?.[1] || '';
  const related = [];
  if (relatedBlock) {
    const cardRe = /<a href="([^"]+)" class="related-post-card">[\s\S]*?<div class="related-post-title">([\s\S]*?)<\/div>[\s\S]*?<span class="related-post-link">([\s\S]*?)<\/span>[\s\S]*?<\/a>/gi;
    let m;
    while ((m = cardRe.exec(relatedBlock)) !== null) {
      related.push(`${m[1]}|${stripTags(m[2])}|${stripTags(m[3]).replace(/\s*â†’\s*$/, '')}`);
    }
  }

  let category = 'system';
  if (slug.startsWith('life-path-')) category = 'life-path';
  if (slug.startsWith('expression-')) category = 'expression';
  if (slug.startsWith('soul-urge-')) category = 'soul-urge';
  if (slug.startsWith('trinity-')) category = 'trinity';
  if (/philosophy|matrix|simulation|aether|shadow|meaning|wrong|transformation/i.test(slug)) category = 'philosophy';

  const bodyMatch = html.match(/<div class="post-body">([\s\S]*?)<div class="related-posts">|<div class="post-body">([\s\S]*?)<div class="post-cta-block">/i);
  const bodyHtml = bodyMatch ? (bodyMatch[1] || bodyMatch[2] || '') : '';
  const body = htmlToMarkdown(bodyHtml);

  const excerpt = body.split(/\n+/).find(l => l.trim() && !l.startsWith('#') && !l.startsWith('- ') && !l.startsWith('> ')) || decodeEntities(desc);

  return {
    title: stripTags(title),
    slug,
    date,
    category,
    glyph: stripTags(glyph),
    eyebrow: stripTags(eyebrow),
    excerpt: excerpt.trim(),
    description: decodeEntities(desc),
    keywords: decodeEntities(keywords),
    breadcrumb: stripTags(breadcrumb),
    cta: stripTags(cta),
    related,
    body
  };
}

function toFrontmatter(p) {
  const lines = [
    '---',
    `title: ${p.title}`,
    `slug: ${p.slug}`,
    `date: ${p.date || '2026-01-01'}`,
    `category: ${p.category}`,
    `glyph: ${p.glyph || 'âœ¦'}`,
    `eyebrow: ${p.eyebrow || ''}`,
    `excerpt: ${p.excerpt}`,
    `description: ${p.description || p.excerpt}`,
    `keywords: ${p.keywords || ''}`,
    `breadcrumb-name: ${p.breadcrumb || p.title}`,
    `cta: ${p.cta || ''}`
  ];
  if (p.related.length) {
    lines.push('related:');
    for (const r of p.related) lines.push(`  - ${r}`);
  }
  lines.push('---', '', p.body, '');
  return lines.join('\n');
}

function main() {
  if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
  const dirs = fs.readdirSync(BLOG_DIR, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
  let converted = 0;
  const kept = [];

  for (const slug of dirs) {
    if (KEEP_HTML.has(slug)) { kept.push(slug); continue; }
    const fp = path.join(BLOG_DIR, slug, 'index.html');
    if (!fs.existsSync(fp)) continue;
    const html = fs.readFileSync(fp, 'utf8');
    const isGenerated = html.includes('class="post-wrap"') && html.includes('class="post-body"') && html.includes('post-cta-block');
    if (!isGenerated) { kept.push(slug); continue; }

    const post = parsePost(html, slug);
    const md = toFrontmatter(post);
    fs.writeFileSync(path.join(CONTENT_DIR, `${slug}.md`), md, 'utf8');
    converted++;
  }

  console.log(`Converted ${converted} posts to content/*.md`);
  console.log(`Kept as HTML (${kept.length}):`);
  console.log(kept.join('\n'));
}

main();

