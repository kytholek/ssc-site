# content/

This directory holds Markdown source files for blog posts.

Run `node build.js` (or `npm run build`) to generate HTML from these files.

## Frontmatter fields

```yaml
---
title: Life Path 3 in Numerology: The Creator
slug: life-path-3-numerology          # URL: /blog/{slug}/
date: 2026-03-20                      # ISO date
category: life-path                   # life-path | expression | soul-urge | system | philosophy
glyph: 3                              # Displayed large in hero (number, symbol, or emoji)
eyebrow: The Numbers · March 2026 · Codex Position 3
excerpt: Short summary shown on blog index cards (1-2 sentences)
description: Meta description for SEO (copy excerpt or write longer)
keywords: life path 3 numerology, numerology, life path number
breadcrumb-name: Life Path 3 Numerology   # Short label for breadcrumb trail
cta: Custom CTA paragraph text above the calculator button (optional)
related:
  - /blog/life-path-2-numerology/|Life Path 2 — The Harmonizer|Read Deep Dive
  - /blog/life-path-4-numerology/|Life Path 4 — The Builder|Read Deep Dive
  - /blog/expression-3-numerology/|Expression 3 — Your Internal Circuit|Read Deep Dive
  - /codex|The Codex Matrix — All 9 Frequencies|Explore
---
```

## Markdown body

Standard Markdown: `## h2`, `### h3`, `**bold**`, `*italic*`, `- list`, `> blockquote`, `[link](url)`.

The body is placed inside `.post-body` div.

## Build commands

```bash
node build.js           # Build only changed files (newer .md than .html)
node build.js --force   # Rebuild all posts regardless of timestamps
npm run build           # Same as node build.js
```

## Category values

| value | Display label |
|-------|--------------|
| `life-path` | Life Paths |
| `expression` | Expressions |
| `soul-urge` | Soul Urge |
| `system` | The System |
| `philosophy` | Philosophy |
| `trinity` | Trinity Series |

## Notes

- Custom-layout posts (five-lenses, infinity-loop, evolution-of-energy, 3-6-9, etc.) stay as raw HTML in `blog/` — do NOT add .md files for those.
- The generated section in `blog/index.html` is hidden (`display:none`) when empty; it becomes visible once at least one card is injected.
- `content/posts.json` is auto-generated — do not edit by hand.
