// ════════════════════════════════════════════════════════════
//  SSC WEBSITE — app.js
//  Routing · Blog (dynamic fetch) · Meta · SEO
//
//  HOW TO ADD A NEW BLOG POST:
//  1. Create  blog/post-your-slug.html  with the post HTML
//  2. Add data attributes to the opening div:
//       data-title="Your Post Title"
//       data-description="1–2 sentence summary for Google."
//       data-date="April 2026"
//       data-og-image="blog/images/optional.png"   ← optional
//  3. Add a card to pages/blog.html pointing to your slug
//  4. Add an entry to POST_SEQUENCE below (copy the pattern)
//  5. Done. Routing, meta, URL, schema, prev/next, related — all automatic.
// ════════════════════════════════════════════════════════════


// ────────────────────────────────────────────────────────────
//  SITE DEFAULTS  ← update to your actual domain / OG image
// ────────────────────────────────────────────────────────────
const SITE = {
  name        : 'Simulation Source Code',
  titleSuffix : ' · SSC Numerology',
  description : 'Discover your seven numerology frequencies — Life Path, Expression, Life Calling, Soul, Outer, Achievement & Theme.',
  ogImage     : 'https://simulationsourcecode.com/ssc-og.png',
  baseUrl     : 'https://simulationsourcecode.com',
  blogPath    : './blog/',
};


// ────────────────────────────────────────────────────────────
//  POST SEQUENCE
//  Defines display order for prev/next navigation and the
//  pool for related article suggestions.
//  Keep in the same order as the blog listing page.
//  'series' marks posts belonging to The System reading series
//  (preferred when picking related articles).
// ────────────────────────────────────────────────────────────
const POST_SEQUENCE = [
  // ── The System series (book order) ──────────────────────
  {
    id      : 'post-simulation',
    category: 'the-system',
    series  : 'the-system',
    title   : 'You Are Running on a Simulation — And Your Numbers Are the Source Code',
    excerpt : 'The foundation of everything. Reality is not happening out there — it is constructed in here, from the inside out.',
  },
  {
    id      : 'post-system',
    category: 'the-system',
    series  : 'the-system',
    title   : 'The Evolution of Energy: 0 Through 9',
    excerpt : 'Numbers are not symbols — they are the routes energy takes through creation. Each frequency a stage in the evolution from void to wisdom.',
  },
  {
    id      : 'post-electric-magnetic-aether',
    category: 'the-system',
    series  : 'the-system',
    title   : 'Electric, Magnetic & Aether: The Three Natures of Number',
    excerpt : 'Four Electric, four Magnetic, two Aetheric. The nine frequencies differ not just in quality but in fundamental nature.',
  },
  {
    id      : 'post-codex-architecture',
    category: 'the-system',
    series  : 'the-system',
    title   : 'The Codex: Architecture of the Consciousness Matrix',
    excerpt : 'A 3x3 map of how consciousness moves — three planes, three columns, one central pivot that everything passes through.',
  },
  {
    id      : 'post-666',
    category: 'the-system',
    series  : 'the-system',
    title   : '666 Is Not What You Think',
    excerpt : 'Around the edges of the Codex, every row reduces to 6. This is the structural law that frames the entire matrix.',
  },
  {
    id      : 'post-369',
    category: 'the-system',
    series  : 'the-system',
    title   : 'The 3-6-9 Pattern: Why Tesla Was Right',
    excerpt : 'Every triple number reduces to 3, 6, or 9. Every column of the Codex sums to 3, 6, or 9.',
  },
  {
    id      : 'post-transformation-path',
    category: 'the-system',
    series  : 'the-system',
    title   : 'The Path of Transformation: 1 to 4 to 7 to 2 to 5 to 8 to 3 to 6 to 9',
    excerpt : 'The Codex encodes a specific nine-step sequence for how transformation actually moves through a person.',
  },
  {
    id      : 'post-five-lenses',
    category: 'the-system',
    series  : 'the-system',
    title   : 'The Five Lenses of Self: Which One Are You Seeing Through?',
    excerpt : 'Ego, Mind, Soul, Spirit, Void — five lenses, five entirely different realities.',
  },
  {
    id      : 'post-decoding-matrix',
    category: 'the-system',
    series  : 'the-system',
    title   : 'Decoding the Matrix: The Complete Architecture of Simulation Source Code',
    excerpt : 'The full picture — holographic reality, the Codex, the nine frequencies, and the seven-number personal blueprint.',
  },
  {
    id      : 'post-angel-numbers',
    category: 'the-system',
    series  : 'the-system',
    title   : 'Angel Numbers Are Being Read Wrong',
    excerpt : 'The message is always personal, always contextual. The internet has stripped out the most important component: you.',
  },
  // ── Numerology ──────────────────────────────────────────
  {
    id      : 'post-lifepath',
    category: 'numerology',
    title   : 'The Life Path Number: Your Primary Frequency',
    excerpt : 'The most fundamental of the seven. The core theme your simulation is designed to explore.',
  },
  {
    id      : 'post-theme-number',
    category: 'numerology',
    title   : "Your Birth Year's Hidden Frequency: The Theme Number",
    excerpt : "The least understood of the seven frequencies — it's not personal, it's atmospheric.",
  },
  {
    id      : 'post-seven',
    category: 'numerology',
    title   : 'Why Seven Frequencies? The Architecture of a Complete Reading',
    excerpt : 'SSC works with seven frequencies — each revealing a different layer of the complete map.',
  },
  // ── The Numbers ─────────────────────────────────────────
  {
    id      : 'post-master',
    category: 'numbers',
    title   : 'Master Numbers 11, 22 & 33: Amplified Purpose',
    excerpt : 'When a number does not reduce, the rules change. Frequencies of amplified potential and amplified challenge.',
  },
  {
    id      : 'post-pythagorean',
    category: 'numbers',
    title   : 'Pythagorean vs. Chaldean Numerology',
    excerpt : 'Two traditions, different letter values. Understanding the difference clarifies everything.',
  },
  // ── Philosophy ──────────────────────────────────────────
  {
    id      : 'post-shadow',
    category: 'philosophy',
    title   : 'The Shadow Side of Your Numbers',
    excerpt : 'Every frequency carries both gift and challenge. Authentic numerology honours the full spectrum.',
  },
  // ── Practice ────────────────────────────────────────────
  {
    id      : 'post-calculate',
    category: 'practice',
    title   : 'How to Calculate Your Life Path by Hand',
    excerpt : 'Step-by-step Pythagorean reduction — so you understand exactly what the calculator is doing.',
  },
  {
    id      : 'post-name',
    category: 'practice',
    title   : 'Which Name Do You Use?',
    excerpt : 'Birth name vs. known name — one of the most common questions, and the answer matters more than most expect.',
  },
  {
    id      : 'post-name-change',
    category: 'practice',
    title   : 'The Name-Changer Dilemma',
    excerpt : "People change their names hoping to change their frequency. Here's why that rarely works.",
  },

  // ── Life Path Deep Dives ─────────────────────────────────────────────
  { id: 'post-lifepath-1', category: 'numbers', title: 'Life Path 1 in Numerology: The Initiator — Meaning, Shadow, and Integration', excerpt: 'The simulation keeps placing you at beginnings and demanding you go first — before you feel ready, before you have approval.' },
  { id: 'post-lifepath-2', category: 'numbers', title: 'Life Path 2 in Numerology: The Bridge — Meaning, Shadow, and Integration', excerpt: 'The simulation keeps testing whether you can stay fully connected to others without losing connection to yourself.' },
  { id: 'post-lifepath-3', category: 'numbers', title: 'Life Path 3 in Numerology: The Creator — Meaning, Shadow, and Integration', excerpt: 'The simulation keeps asking you to find and use your authentic voice — not the one that earns approval, but the one that carries something real.' },
  { id: 'post-lifepath-4', category: 'numbers', title: 'Life Path 4 in Numerology: The Builder — Meaning, Shadow, and Integration', excerpt: 'The simulation keeps collapsing whatever you build on unstable ground — and keeps presenting the opportunity to build something that lasts.' },
  { id: 'post-lifepath-5', category: 'numbers', title: 'Life Path 5 in Numerology: The Explorer — Meaning, Shadow, and Integration', excerpt: 'The simulation keeps moving the ground beneath you — not to destabilise you, but to teach you that real stability lives in your own presence.' },
  { id: 'post-lifepath-6', category: 'numbers', title: 'Life Path 6 in Numerology: The Nurturer — Meaning, Shadow, and Integration', excerpt: 'The simulation keeps placing people who need your care in your path — and asking whether you can meet that need without making their need your identity.' },
  { id: 'post-lifepath-7', category: 'numbers', title: 'Life Path 7 in Numerology: The Seeker — Meaning, Shadow, and Integration', excerpt: 'The simulation keeps stripping away what you thought you knew — not to leave you lost, but to force you toward something genuinely true.' },
  { id: 'post-lifepath-8', category: 'numbers', title: 'Life Path 8 in Numerology: The Powerhouse — Meaning, Shadow, and Integration', excerpt: 'The simulation keeps placing you in power dynamics and asking whether you can govern yourself before you try to govern anything else.' },
  { id: 'post-lifepath-9', category: 'numbers', title: 'Life Path 9 in Numerology: The Completor — Meaning, Shadow, and Integration', excerpt: 'The simulation keeps bringing things to completion and asking whether you can release what is finished rather than dragging it into the next chapter.' },
];

// Quick lookup map: id -> { ...post, index }
const POST_MAP = Object.fromEntries(POST_SEQUENCE.map((p, i) => [p.id, { ...p, index: i }]));


// Per-page meta
const PAGE_META = {
  home: {
    title      : 'Simulation Source Code · Numerology Calculator · Decode Your Blueprint',
    description: 'Decode the seven frequencies encoded in your birth date and name — Life Path, Expression, Life Calling, Soul Urge, Outer Persona, Achievement, and Theme. Free numerology calculator.',
  },
  calculator: {
    title      : 'Free Numerology Calculator · Seven Frequencies · Simulation Source Code',
    description: 'Calculate your seven core numerology frequencies instantly. Life Path, Expression, Soul Urge, Outer Persona, Achievement, Theme, and Life Calling — from your birth date and full name.',
  },
  books: {
    title      : 'Recommended Numerology Books · Simulation Source Code',
    description: 'A curated library of numerology, consciousness, and simulation theory books — the essential reading for understanding the system behind Simulation Source Code.',
  },
  blog: {
    title      : 'Numerology Blog · Simulation Source Code · The System Series',
    description: 'Deep dives into numerology, the 3×3 Codex, simulation theory, and consciousness. The System Series, the nine frequencies, 369, 666, angel numbers, and more.',
  },
  about: {
    title      : 'About Simulation Source Code · Numerology Framework',
    description: 'Simulation Source Code is a numerology framework built on Pythagorean principles, simulation theory, and consciousness research — offering practical, grounded readings of your seven encoded frequencies.',
  },
  services: {
    title      : 'Numerology Services · Guidebook, Consultation & Membership · SSC',
    description: 'Choose your depth of decoding — a personalised PDF guidebook, a live one-on-one consultation, or a monthly membership to learn the system yourself.',
  },
  privacy: {
    title      : 'Privacy Policy · Simulation Source Code',
    description: 'How Simulation Source Code handles your data. All calculator inputs are processed locally and never stored on our servers.',
  },
};


// ────────────────────────────────────────────────────────────
//  POST CONTAINER
// ────────────────────────────────────────────────────────────
let _postContainer = null;
let _postCache     = {};
let _currentPostId = null;

function _getPostContainer() {
  if (!_postContainer) {
    _postContainer = document.getElementById('blog-post-container');
    if (!_postContainer) {
      _postContainer = document.createElement('div');
      _postContainer.id = 'blog-post-container';
      const blogPage = document.getElementById('page-blog');
      if (blogPage) blogPage.appendChild(_postContainer);
    }
  }
  return _postContainer;
}


// ────────────────────────────────────────────────────────────
//  READ POST META FROM DOM
// ────────────────────────────────────────────────────────────
function _getPostMeta(postEl, id) {
  if (!postEl) return null;
  const rawTitle = postEl.dataset.title
    || postEl.querySelector('.blog-post-title')?.textContent?.trim()
    || id;
  return {
    id         : id,
    title      : rawTitle + SITE.titleSuffix,
    description: postEl.dataset.description || SITE.description,
    date       : postEl.dataset.date        || '',
    ogImage    : postEl.dataset.ogImage     || SITE.ogImage,
  };
}


// ────────────────────────────────────────────────────────────
//  FETCH + INJECT POST HTML
// ────────────────────────────────────────────────────────────
async function _loadPost(id) {
  if (_postCache[id]) return _postCache[id];
  const url = SITE.blogPath + id + '.html';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const html = await res.text();
    _postCache[id] = html;
    return html;
  } catch (err) {
    console.error(`[SSC] Failed to load post: ${url}`, err);
    return null;
  }
}


// ────────────────────────────────────────────────────────────
//  HTML ESCAPE HELPER
// ────────────────────────────────────────────────────────────
function _esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


// ────────────────────────────────────────────────────────────
//  PICK RELATED POSTS
//  Priority: same series → same category → everything else
//  Shuffles within each tier so it varies on each visit.
// ────────────────────────────────────────────────────────────
function _pickRelated(currentId, category, series, count) {
  const pool = POST_SEQUENCE.filter(p => p.id !== currentId);
  const shuffle = arr => arr.sort(() => Math.random() - 0.5);

  const sameSeries = series ? shuffle(pool.filter(p => p.series === series)) : [];
  const sameCat    = shuffle(pool.filter(p => p.category === category && !sameSeries.includes(p)));
  const others     = shuffle(pool.filter(p => !sameSeries.includes(p) && !sameCat.includes(p)));

  return [...sameSeries, ...sameCat, ...others].slice(0, count);
}


// ────────────────────────────────────────────────────────────
//  CATEGORY HELPERS
// ────────────────────────────────────────────────────────────
function _tagClass(cat) {
  if (cat === 'the-system') return 'blog-tag gold';
  if (cat === 'numbers')    return 'blog-tag teal';
  if (cat === 'practice')   return 'blog-tag rose';
  return 'blog-tag';
}

function _catLabel(cat) {
  const map = {
    'the-system': 'The System',
    numerology  : 'Numerology',
    numbers     : 'The Numbers',
    philosophy  : 'Philosophy',
    practice    : 'Practice',
  };
  return map[cat] || cat;
}


// ────────────────────────────────────────────────────────────
//  INJECT PREV / NEXT + RELATED FOOTER
//  Appended to #blog-post-container after each post loads.
// ────────────────────────────────────────────────────────────
function _injectPostNav(id) {
  const container = _getPostContainer();

  // Remove any previously injected footer
  const old = container.querySelector('.post-nav-footer');
  if (old) old.remove();

  const current = POST_MAP[id];
  if (!current) return;

  const idx  = current.index;
  const prev = idx > 0                        ? POST_SEQUENCE[idx - 1] : null;
  const next = idx < POST_SEQUENCE.length - 1 ? POST_SEQUENCE[idx + 1] : null;

  const related = _pickRelated(id, current.category, current.series, 3);

  // Prev button
  const prevHTML = prev
    ? `<button class="post-nav-btn post-nav-prev" onclick="openPost('${prev.id}')">
         <span class="post-nav-arrow">&#8592;</span>
         <span class="post-nav-label">
           <span class="post-nav-hint">Previous</span>
           <span class="post-nav-title">${_esc(prev.title)}</span>
         </span>
       </button>`
    : `<div class="post-nav-spacer"></div>`;

  // Next button
  const nextHTML = next
    ? `<button class="post-nav-btn post-nav-next" onclick="openPost('${next.id}')">
         <span class="post-nav-label post-nav-label-right">
           <span class="post-nav-hint">Next</span>
           <span class="post-nav-title">${_esc(next.title)}</span>
         </span>
         <span class="post-nav-arrow">&#8594;</span>
       </button>`
    : `<div class="post-nav-spacer"></div>`;

  // Related cards
  const relatedHTML = related.map(p => `
    <div class="blog-card post-related-card" onclick="openPost('${p.id}')">
      <div class="blog-card-body" style="padding:20px 20px 16px">
        <div class="blog-card-meta" style="margin-bottom:8px">
          <span class="${_tagClass(p.category)}">${_catLabel(p.category)}</span>
        </div>
        <div class="blog-card-title" style="font-size:15px;margin-bottom:8px;line-height:1.4">${_esc(p.title)}</div>
        <p  class="blog-card-excerpt" style="font-size:13px;-webkit-line-clamp:2;line-clamp:2;margin:0 0 10px">${_esc(p.excerpt)}</p>
        <div class="blog-read-more" style="font-size:12px;margin-top:auto">Read Article &#8594;</div>
      </div>
    </div>`).join('');

  const footer = document.createElement('div');
  footer.className = 'post-nav-footer';
  footer.innerHTML = `
    <div class="post-nav-divider"></div>
    <div class="post-nav-row">
      ${prevHTML}
      ${nextHTML}
    </div>
    ${related.length ? `
    <div class="post-related-section">
      <div class="post-related-eyebrow">&#xB7;&nbsp; Continue Reading &nbsp;&#xB7;</div>
      <div class="post-related-grid">${relatedHTML}</div>
    </div>` : ''}
  `;

  container.appendChild(footer);
}


// ────────────────────────────────────────────────────────────
//  META TAG HELPERS
// ────────────────────────────────────────────────────────────
function setMeta(title, description, ogImage, canonicalUrl) {
  document.title = title;
  _setMetaName('description',         description);
  _setOgTag   ('og:title',            title);
  _setOgTag   ('og:description',      description);
  _setOgTag   ('og:image',            ogImage      || SITE.ogImage);
  _setOgTag   ('og:url',              canonicalUrl || window.location.href);
  _setOgTag   ('og:type',             'article');
  _setMetaName('twitter:card',        'summary_large_image');
  _setMetaName('twitter:title',       title);
  _setMetaName('twitter:description', description);
  _setMetaName('twitter:image',       ogImage      || SITE.ogImage);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl || window.location.href;
}

function _setOgTag(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
  el.content = content;
}

function _setMetaName(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
  el.content = content;
}

function _setJsonLd(data) {
  let el = document.getElementById('page-jsonld');
  if (!el) { el = document.createElement('script'); el.id = 'page-jsonld'; el.type = 'application/ld+json'; document.head.appendChild(el); }
  el.text = JSON.stringify(data);
}

function _clearJsonLd() {
  const el = document.getElementById('page-jsonld');
  if (el) el.remove();
}

function _setArticleSchema(post) {
  _setJsonLd({
    '@context'    : 'https://schema.org',
    '@type'       : 'Article',
    headline      : post.title.replace(/ · SSC.*$/, ''),
    description   : post.description,
    datePublished : post.date,
    image         : post.ogImage,
    url           : SITE.baseUrl + '/?post=' + post.id,
    author        : { '@type': 'Organization', name: SITE.name },
    publisher     : {
      '@type': 'Organization',
      name   : SITE.name,
      logo   : { '@type': 'ImageObject', url: SITE.baseUrl + '/ssc-logo.png' },
    },
  });
}


// ────────────────────────────────────────────────────────────
//  PAGE ROUTING
// ────────────────────────────────────────────────────────────
function showPage(name, pushState = true) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  // Hide blog post container when switching to non-blog pages
  // When switching TO blog page, show the listing
  if (name !== 'blog') {
    const container = _getPostContainer();
    if (container) container.style.display = 'none';
  } else {
    const listing = document.getElementById('blog-listing');
    const container = _getPostContainer();
    if (listing) listing.style.display = 'block';
    if (container) container.style.display = 'none';
  }

  const page = document.getElementById('page-' + name);
  if (page) { page.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  const navLink = document.getElementById('nav-' + name);
  if (navLink) navLink.classList.add('active');

  const meta = PAGE_META[name] || { title: name + SITE.titleSuffix, description: SITE.description };
  const url  = name === 'home' ? '/' : '/?page=' + name;
  setMeta(meta.title, meta.description, SITE.ogImage, SITE.baseUrl + url);
  _clearJsonLd();

  if (pushState) history.pushState({ page: name, post: null }, meta.title, url);

  // Inject page-specific structured data
  _injectPageSchema(name);
}

function _injectPageSchema(name) {
  _clearJsonLd();
  if (name === 'calculator' || name === 'home') {
    _setJsonLd({
      '@context'   : 'https://schema.org',
      '@type'      : 'WebApplication',
      'name'       : 'SSC Numerology Calculator',
      'url'        : 'https://simulationsourcecode.com/?page=calculator',
      'description': 'Free numerology calculator. Enter your birth date and full name to calculate your seven core frequencies: Life Path, Expression, Life Calling, Soul Urge, Outer Persona, Achievement, and Theme.',
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem'    : 'Any',
      'offers': {
        '@type'       : 'Offer',
        'price'       : '0',
        'priceCurrency': 'USD',
        'description' : 'Free numerology frequency calculator'
      },
      'author': { '@type': 'Organization', 'name': 'Simulation Source Code' }
    });
  } else if (name === 'services') {
    _setJsonLd({
      '@context': 'https://schema.org',
      '@type'   : 'Service',
      'name'    : 'Numerology Readings — Simulation Source Code',
      'url'     : 'https://simulationsourcecode.com/?page=services',
      'description': 'Personalised numerology guidebook PDF, live consultation, and group membership.',
      'provider': { '@type': 'Organization', 'name': 'Simulation Source Code' },
      'offers'  : [
        { '@type': 'Offer', 'name': 'Holographic Blueprint PDF', 'price': '37', 'priceCurrency': 'USD' },
        { '@type': 'Offer', 'name': 'Personal Consultation',     'price': '120','priceCurrency': 'USD' },
        { '@type': 'Offer', 'name': 'Monthly Membership',        'price': '20', 'priceCurrency': 'USD', 'priceSpecification': { '@type': 'RecurringCharges', 'billingPeriod': 'Month' } }
      ]
    });
  } else if (name === 'about') {
    _setJsonLd({
      '@context'   : 'https://schema.org',
      '@type'      : 'AboutPage',
      'name'       : 'About Simulation Source Code',
      'url'        : 'https://simulationsourcecode.com/?page=about',
      'description': 'Simulation Source Code is a numerology framework built on Pythagorean principles, simulation theory, and consciousness research.',
      'author'     : { '@type': 'Organization', 'name': 'Simulation Source Code' }
    });
  }
}


// ────────────────────────────────────────────────────────────
//  MOBILE MENU
// ────────────────────────────────────────────────────────────
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}


// ────────────────────────────────────────────────────────────
//  BLOG — open / close / filter
// ────────────────────────────────────────────────────────────
async function openPost(id, pushState = true) {
  const blogPage = document.getElementById('page-blog');
  if (blogPage && !blogPage.classList.contains('active')) {
    showPage('blog', false);
  }

  const listing   = document.getElementById('blog-listing');
  const container = _getPostContainer();

  if (listing) listing.style.display = 'none';
  container.style.display = 'block';

  if (_currentPostId !== id) {
    container.innerHTML = '<div class="blog-post-loading">Loading&#8230;</div>';
  }

  const html = await _loadPost(id);

  if (!html) {
    container.innerHTML = '<div class="blog-post-error"><p>Could not load this post. <button onclick="closePosts()">&#8592; Back to Blog</button></p></div>';
    return;
  }

  if (_currentPostId !== id) {
    container.innerHTML = html;
    _currentPostId = id;
  }

  // Inject prev/next + related footer
  _injectPostNav(id);

  window.scrollTo({ top: 0, behavior: 'smooth' });

  const postEl = container.querySelector(`#${id}`);
  
  // Remove active class from any previously active post and add to current
  document.querySelectorAll('.blog-post').forEach(p => p.classList.remove('active'));
  if (postEl) postEl.classList.add('active');
  
  const meta   = _getPostMeta(postEl, id);
  const canonicalUrl = SITE.baseUrl + '/?post=' + id;

  if (meta) {
    setMeta(meta.title, meta.description, meta.ogImage, canonicalUrl);
    _setArticleSchema(meta);
  }

  if (pushState) history.pushState({ page: 'blog', post: id }, meta?.title || id, '/?post=' + id);
}

function closePosts(pushState = true) {
  const listing   = document.getElementById('blog-listing');
  const container = _getPostContainer();

  if (listing) listing.style.display = 'block';
  container.style.display = 'none';
  _currentPostId = null;

  window.scrollTo({ top: 0, behavior: 'smooth' });

  const meta = PAGE_META.blog;
  setMeta(meta.title, meta.description, SITE.ogImage, SITE.baseUrl + '/?page=blog');
  _clearJsonLd();

  if (pushState) history.pushState({ page: 'blog', post: null }, meta.title, '/?page=blog');
}

function filterBlog(category, btn) {
  document.querySelectorAll('.blog-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const systemHeader = document.getElementById('system-series-header');
  const systemSeries = document.getElementById('blog-system-series');
  const moreHeader   = document.getElementById('blog-more-header');
  const showAll      = category === 'all';
  const showSystem   = showAll || category === 'the-system';

  if (systemHeader) systemHeader.style.display = showSystem ? '' : 'none';
  if (systemSeries) systemSeries.style.display = showSystem ? '' : 'none';
  if (moreHeader)   moreHeader.style.display   = (showAll || category !== 'the-system') ? '' : 'none';

  document.querySelectorAll('#blog-grid .blog-card').forEach(card => {
    card.style.display = (showAll || card.dataset.category === category) ? 'flex' : 'none';
  });

  // Also filter the Life Path grid
  document.querySelectorAll('#blog-grid-lp .blog-card').forEach(card => {
    card.style.display = (showAll || card.dataset.category === category) ? 'flex' : 'none';
  });
}


// ────────────────────────────────────────────────────────────
//  POPSTATE
// ────────────────────────────────────────────────────────────
window.addEventListener('popstate', e => {
  const s = e.state;
  if (!s)        { showPage('home', false); return; }
  if (s.post)    { openPost(s.post, false); }
  else if (s.page) showPage(s.page, false);
  else             showPage('home', false);
});


// ────────────────────────────────────────────────────────────
//  DEEP LINK ON LOAD
// ────────────────────────────────────────────────────────────
async function handleDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('post');
  const pageId = params.get('page');

  if (postId) {
    showPage('blog', false);
    await openPost(postId, false);
    history.replaceState({ page: 'blog', post: postId }, document.title, '/?post=' + postId);
  } else if (pageId && PAGE_META[pageId]) {
    showPage(pageId, false);
    history.replaceState({ page: pageId, post: null }, document.title, '/?page=' + pageId);
  } else {
    showPage('home', false);
    history.replaceState({ page: 'home', post: null }, document.title, '/');
  }
}


// ────────────────────────────────────────────────────────────
//  INIT
// ────────────────────────────────────────────────────────────
async function initApp() {
  await handleDeepLink();
  // Apply saved language preference on every load
  applyLanguage(getLang());
  _updateLangToggle(getLang());
}


// ────────────────────────────────────────────────────────────
//  EXPOSE to inline onclick attributes
// ────────────────────────────────────────────────────────────
window.toggleMenu = toggleMenu;
window.showPage   = showPage;
window.openPost   = openPost;
window.closePosts = closePosts;
window.filterBlog = filterBlog;


// ────────────────────────────────────────────────────────────
//  FALLBACK for calc button
// ────────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  if (e.target?.classList.contains('calc-btn')) calculateReading();
});


// ════════════════════════════════════════════════════════════
//  i18n — LANGUAGE SYSTEM
//  Reads SSC_TRANSLATIONS from translations.js
//  Applies to all [data-i18n] elements on the page
// ════════════════════════════════════════════════════════════

const I18N_KEY     = 'ssc-lang';
const I18N_DEFAULT = 'en';

// Returns the active language ('en' or 'es')
function getLang() {
  return localStorage.getItem(I18N_KEY) || I18N_DEFAULT;
}

// Swap to a language and re-render all keyed elements
function setLang(lang) {
  localStorage.setItem(I18N_KEY, lang);
  applyLanguage(lang);
  _updateLangToggle(lang);
}

// Toggle between en ↔ es
function toggleLang() {
  setLang(getLang() === 'en' ? 'es' : 'en');
}

// Apply translations to every [data-i18n] element in the DOM
// Fades elements out, swaps text, fades back in
function applyLanguage(lang) {
  lang = lang || getLang();
  if (typeof SSC_TRANSLATIONS === 'undefined') return;

  const els = document.querySelectorAll('[data-i18n]');

  // If this is a user-triggered swap, do a quick fade
  const isSwap = document._i18nReady;
  if (isSwap) els.forEach(el => el.classList.add('lang-switching'));

  const doSwap = () => {
    els.forEach(el => {
      const key   = el.dataset.i18n;
      const entry = SSC_TRANSLATIONS[key];
      if (!entry) return;
      const text = entry[lang] || entry[I18N_DEFAULT] || '';
      if (text.includes('<') || text.includes('&')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    // Handle data-i18n-placeholder (e.g. calculator name input)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key   = el.dataset.i18nPlaceholder;
      const entry = SSC_TRANSLATIONS[key];
      if (entry) el.placeholder = entry[lang] || entry[I18N_DEFAULT] || '';
    });
    document.documentElement.lang = lang;
    if (isSwap) {
      requestAnimationFrame(() => els.forEach(el => el.classList.remove('lang-switching')));
    }

    // If a reading is currently on screen, re-render it in the new language
    const resultsArea = document.getElementById('results-area');
    const hasReading  = resultsArea && !resultsArea.querySelector('.results-placeholder-icon');
    if (hasReading && typeof calculateReading === 'function') {
      const month = document.getElementById('calc-month')?.value;
      const day   = document.getElementById('calc-day')?.value;
      const year  = document.getElementById('calc-year')?.value;
      const name  = document.getElementById('calc-fullname')?.value;
      if (month && day && year && name) calculateReading();
    }
  };

  if (isSwap) {
    setTimeout(doSwap, 180);
  } else {
    doSwap();
    document._i18nReady = true; // mark ready for future swaps
  }
}

// Keep the toggle button label in sync
function _updateLangToggle(lang) {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  btn.textContent = lang === 'en' ? 'ES' : 'EN';
  btn.setAttribute('aria-label', lang === 'en' ? 'Switch to Spanish' : 'Switch to English');
  btn.setAttribute('title',      lang === 'en' ? 'Ver en Español'    : 'View in English');
}

// Expose
window.toggleLang    = toggleLang;
window.setLang       = setLang;
window.applyLanguage = applyLanguage;


// ════════════════════════════════════════════════════════════
//  CALCULATOR MODAL — Services Page
//  Pop-up calculator overlay for guidebook purchase flow
// ════════════════════════════════════════════════════════════

function openCalculatorModal() {
  var overlay = document.getElementById('calculator-modal-overlay');
  if (overlay) overlay.classList.add('open');
}

function closeCalculatorModal() {
  var overlay = document.getElementById('calculator-modal-overlay');
  if (overlay) overlay.classList.remove('open');
  resetCalculatorModal();
}

function resetCalculatorModal() {
  document.getElementById('modal-calc-month').value = '';
  document.getElementById('modal-calc-day').value = '';
  document.getElementById('modal-calc-year').value = '';
  document.getElementById('modal-calc-fullname').value = '';
  document.getElementById('modal-results-area').innerHTML = '<div class="results-placeholder-icon">✦</div><div class="results-placeholder-text" data-i18n="calc.results.placeholder">Your reading will appear here</div>';
  document.getElementById('modal-unlock-cta').style.display = 'none';
  document.getElementById('modal-unlock-cta').setAttribute('aria-hidden', 'true');
  document.getElementById('modal-unlock-email').value = '';
  document.getElementById('modal-unlock-email-error').textContent = '';
}

function calculateReadingModal() {
  // Copy values from modal inputs to global calculator inputs
  document.getElementById('calc-month').value = document.getElementById('modal-calc-month').value;
  document.getElementById('calc-day').value = document.getElementById('modal-calc-day').value;
  document.getElementById('calc-year').value = document.getElementById('modal-calc-year').value;
  document.getElementById('calc-fullname').value = document.getElementById('modal-calc-fullname').value;
  
  // Call the global calculateReading function
  calculateReading();
  
  // Copy results back to modal
  var mapContainer = document.getElementById('freq-map');
  if (mapContainer) {
    document.getElementById('modal-results-area').innerHTML = mapContainer.outerHTML;
  }
  
  // Show unlock CTA in modal
  showUnlockCTAModal();
}

function showUnlockCTAModal() {
  document.getElementById('modal-unlock-cta').style.display = 'block';
  document.getElementById('modal-unlock-cta').setAttribute('aria-hidden', 'false');
  document.getElementById('modal-unlock-cta').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function handleUnlockPaymentModal() {
  var emailInput = document.getElementById('modal-unlock-email');
  var errorEl   = document.getElementById('modal-unlock-email-error');
  var btn        = document.getElementById('modal-unlock-pay-btn');
  var email      = (emailInput ? emailInput.value : '').trim();

  console.log('=== handleUnlockPaymentModal called ===');
  console.log('Email:', email);
  console.log('Button element:', btn);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.log('Invalid email, returning');
    if (errorEl) {
      errorEl.textContent = 'Please enter a valid email address.';
      errorEl.style.color = 'var(--rose-light)';
    }
    if (emailInput) emailInput.focus();
    return;
  }
  if (errorEl) errorEl.textContent = '';

  var resultsArea = document.getElementById('modal-results-area');
  var userPayload = {
    email:    email,
    name:     document.getElementById('modal-calc-fullname').value || '',
    month:    document.getElementById('modal-calc-month').value || '',
    day:      document.getElementById('modal-calc-day').value || '',
    year:     document.getElementById('modal-calc-year').value || '',
    results:  resultsArea ? resultsArea.innerText : ''
  };

  try {
    sessionStorage.setItem('ssc_pending_order', JSON.stringify(userPayload));
  } catch(e) {}

  btn.disabled    = true;
  btn.textContent = '· Connecting to Stripe ·';

  console.log('Sending payload:', JSON.stringify(userPayload));

  // ── Call Netlify function to create checkout session ─────────────────
  fetch('/.netlify/functions/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email:  email,
      name:   userPayload.name,
      month:  userPayload.month,
      day:    userPayload.day,
      year:   userPayload.year
    })
  })
  .then(response => {
    console.log('Fetch response status:', response.status);
    if (!response.ok) {
      return response.json().then(data => {
        console.error('Error response:', data);
        throw new Error(data.error || `HTTP ${response.status}`);
      }).catch(err => {
        console.error('Error parsing error response:', err);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('Checkout response:', data);
    if (data.url) {
      console.log('Redirecting to:', data.url);
      // Redirect to Stripe checkout
      window.location.href = data.url;
    } else {
      throw new Error(data.error || 'Failed to create checkout session');
    }
  })
  .catch(err => {
    console.error('Checkout error:', err);
    if (errorEl) {
      errorEl.textContent = 'Checkout failed: ' + err.message;
      errorEl.style.color = 'var(--rose-light)';
    }
    btn.disabled    = false;
    btn.textContent = '⬡&nbsp;&nbsp;Receive My Guidebook&nbsp;&nbsp;⬡';
  });
}

// Expose
window.openCalculatorModal = openCalculatorModal;
window.closeCalculatorModal = closeCalculatorModal;
window.calculateReadingModal = calculateReadingModal;
window.handleUnlockPaymentModal = handleUnlockPaymentModal;
