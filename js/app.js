// ════════════════════════════════════════════════════════════
//  SSC WEBSITE — app.js
//  Routing · Blog · Meta · SEO
// ════════════════════════════════════════════════════════════


// ────────────────────────────────────────────────────────────
//  SITE META DEFAULTS
//  Used when no page/post-specific meta is defined
// ────────────────────────────────────────────────────────────
baseUrl : 'https://simulationsourcecode.com',  // ← your actual domain
ogImage : 'https://simulationsourcecode.com/ssc-og.png', // ← your OG image

const SITE_META = {
  siteName  : 'Simulation Source Code',
  titleSuffix: ' · SSC Numerology',
  description: 'Discover your seven numerology frequencies — Life Path, Expression, Life Calling, Soul, Outer, Achievement & Theme.',
  ogImage   : 'https://simulationsourcecode.com/ssc-og.png', // ← update to your actual OG image URL
  baseUrl   : 'https://simulationsourcecode.com',            // ← update to your actual domain
};

// Page-level meta (for non-blog pages)
const PAGE_META = {
  home: {
    title      : 'Simulation Source Code · Numerology',
    description: 'Discover the seven frequencies encoded in your birth and name. Free numerology calculator — Life Path, Expression, Life Calling and more.',
  },
  calculator: {
    title      : 'Free Numerology Calculator · SSC',
    description: 'Calculate your seven core frequencies: Life Path, Expression, Soul, Outer, Achievement, Theme, and Life Calling. Free and instant.',
  },
  books: {
    title      : 'Decoding The Matrix · SSC Books',
    description: 'The Simulation Source Code book — a complete guide to numerology as the source code of a holographic reality.',
  },
  blog: {
    title      : 'Blog · SSC Numerology',
    description: 'Deep dives into numerology, sacred mathematics, and the philosophy of simulated reality.',
  },
  about: {
    title      : 'About · Simulation Source Code',
    description: 'The philosophy and system behind Simulation Source Code numerology.',
  },
};


// ────────────────────────────────────────────────────────────
//  BLOG POST METADATA REGISTRY
//
//  Add a new entry here for every new blog post.
//  Fields:
//    title       — Full post title (used in <title> and OG)
//    description — 1–2 sentence summary (used in meta description and OG)
//    category    — Matches data-category on the card (for filtering)
//    date        — Publication date string e.g. "March 2026"
//    slug        — URL-friendly ID, matches the post div id="post-{slug}"
//    ogImage     — Optional: post-specific OG image path. Falls back to SITE_META.ogImage
//
//  HOW TO ADD A NEW POST:
//  1. Write the post HTML in blog.html (card + post div, id="post-your-slug")
//  2. Add an entry below with matching slug
//  3. Done — routing, meta, and URL handling are automatic
// ────────────────────────────────────────────────────────────
const POST_META = {

  // ── Existing posts ──────────────────────────────────────
  'post-system': {
    slug       : 'post-system',
    title      : 'The Evolution of Energy · SSC',
    description: 'From the Void of Zero to the Dispersal of Nine — the complete evolution of energy through the nine numerical frequencies.',
    category   : 'numbers',
    date       : 'March 2025',
  },
  'post-simulation': {
    slug       : 'post-simulation',
    title      : 'You Are Running on a Simulation — And Your Numbers Are the Source Code',
    description: 'Modern physics increasingly suggests reality is information. If the universe is computational, your birth numbers are literal parameters of your simulation.',
    category   : 'philosophy',
    date       : 'December 2024',
  },
  'post-lifepath': {
    slug       : 'post-lifepath',
    title      : 'The Life Path Number: Your Primary Frequency · SSC',
    description: 'Of all seven frequencies, Life Path is the most fundamental. It describes not what you will do, but what you are here to learn.',
    category   : 'numerology',
    date       : 'November 2024',
  },
  'post-master': {
    slug       : 'post-master',
    title      : 'Master Numbers 11, 22 & 33: Amplified Purpose · SSC',
    description: 'When a number reduces to 11, 22, or 33, the rules change. These are master numbers — frequencies of amplified potential and amplified challenge.',
    category   : 'numbers',
    date       : 'October 2024',
  },
  'post-name': {
    slug       : 'post-name',
    title      : 'Which Name Do You Use? Birth Name vs. Known Name in Numerology',
    description: 'Do you use the name on your birth certificate, or the name you go by? The answer matters more than you think.',
    category   : 'practice',
    date       : 'October 2024',
  },
  'post-seven': {
    slug       : 'post-seven',
    title      : 'Why Seven Frequencies? The Architecture of a Complete Reading · SSC',
    description: 'Traditional numerology focuses on three or four numbers. SSC works with seven. Each one reveals a different layer of who you are.',
    category   : 'numerology',
    date       : 'September 2024',
  },
  'post-pythagorean': {
    slug       : 'post-pythagorean',
    title      : 'Pythagorean vs. Chaldean Numerology: What\'s the Difference?',
    description: 'Two major traditions assign different values to letters. Understanding why SSC uses the Pythagorean system clarifies everything.',
    category   : 'numbers',
    date       : 'August 2024',
  },
  'post-shadow': {
    slug       : 'post-shadow',
    title      : 'The Shadow Side of Your Numbers: What Numerology Doesn\'t Tell You',
    description: 'Every number carries both gift and challenge. Authentic numerology honours the full spectrum — not just the flattering half.',
    category   : 'philosophy',
    date       : 'July 2024',
  },
  'post-calculate': {
    slug       : 'post-calculate',
    title      : 'How to Calculate Your Life Path Number by Hand · SSC',
    description: 'A step-by-step walkthrough of the Pythagorean reduction method so you understand exactly what the calculator is doing and why.',
    category   : 'practice',
    date       : 'June 2024',
  },

  // ── March 2026 batch ────────────────────────────────────
  'post-angel-numbers': {
    slug       : 'post-angel-numbers',
    title      : 'Angel Numbers Are Being Read Wrong · SSC',
    description: 'The internet has given angel numbers a universal meaning. But the message is always personal — and stripping out the context strips out the most important part.',
    category   : 'practice',
    date       : 'March 2026',
  },
  'post-name-change': {
    slug       : 'post-name-change',
    title      : 'The Name-Changer Dilemma: Why You Can\'t Cheat the Simulation',
    description: 'People change their names hoping to change their frequency. Here\'s why that rarely works — and what it would actually take if you tried.',
    category   : 'practice',
    date       : 'March 2026',
  },
  'post-666': {
    slug       : 'post-666',
    title      : '666 Is Not What You Think · SSC Numerology',
    description: 'One of the most feared number sequences in Western culture is actually a structural law encoded into the consciousness matrix. Here\'s what it actually means.',
    category   : 'numbers',
    date       : 'March 2026',
  },
  'post-369': {
    slug       : 'post-369',
    title      : 'The 3–6–9 Pattern: Why Tesla Was Right · SSC',
    description: 'Tesla said 3, 6, and 9 were the key to the universe. The Codex shows exactly why — and what these frequencies reveal about Mind, Body, and Spirit.',
    category   : 'numbers',
    date       : 'March 2026',
  },
  'post-five-lenses': {
    slug       : 'post-five-lenses',
    title      : 'The Five Lenses of Self: Which One Are You Seeing Through? · SSC',
    description: 'Ego, Mind, Soul, Spirit, and Void — five layers of self, five entirely different experiences of the same reality. Which one are you looking through right now?',
    category   : 'philosophy',
    date       : 'March 2026',
  },
  'post-transformation-path': {
    slug       : 'post-transformation-path',
    title      : 'The Path of Transformation: 1→4→7→2→5→8→3→6→9 · SSC',
    description: 'The Codex encodes a specific nine-step sequence for how transformation actually moves through a person. This is not a theory — it is the operational rhythm of becoming.',
    category   : 'the-system',
    date       : 'March 2026',
  },
  'post-theme-number': {
    slug       : 'post-theme-number',
    title      : 'Your Birth Year\'s Hidden Frequency: The Theme Number Explained',
    description: 'Of the seven frequencies in your blueprint, the Theme number is the least understood. It\'s not personal — it\'s atmospheric. That distinction changes everything.',
    category   : 'numerology',
    date       : 'March 2026',
  },

  // ── ADD NEW POSTS BELOW THIS LINE ───────────────────────
  // Template — copy, fill in, and uncomment:
  //
  // 'post-your-slug': {
  //   slug       : 'post-your-slug',
  //   title      : 'Your Post Title · SSC',
  //   description: '1–2 sentences. What is this post about? Be specific — this appears in Google results.',
  //   category   : 'numerology', // numerology | philosophy | numbers | practice | the-system
  //   date       : 'April 2026',
  //   ogImage    : 'blog/images/your-post-image.png', // optional
  // },

};


// ────────────────────────────────────────────────────────────
//  META TAG HELPERS
// ────────────────────────────────────────────────────────────

function setMeta(title, description, ogImage, canonicalUrl) {
  // <title>
  document.title = title;

  // <meta name="description">
  let desc = document.querySelector('meta[name="description"]');
  if (!desc) {
    desc = document.createElement('meta');
    desc.setAttribute('name', 'description');
    document.head.appendChild(desc);
  }
  desc.setAttribute('content', description);

  // Open Graph
  _setOgTag('og:title',       title);
  _setOgTag('og:description', description);
  _setOgTag('og:image',       ogImage || SITE_META.ogImage);
  _setOgTag('og:url',         canonicalUrl || window.location.href);

  // Twitter Card
  _setMetaName('twitter:card',        'summary_large_image');
  _setMetaName('twitter:title',       title);
  _setMetaName('twitter:description', description);
  _setMetaName('twitter:image',       ogImage || SITE_META.ogImage);

  // Canonical link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl || window.location.href);
}

function _setOgTag(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function _setMetaName(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function injectArticleJsonLd(post) {
  // Remove any existing article schema
  const existing = document.getElementById('article-jsonld');
  if (existing) existing.remove();

  const schema = {
    '@context'       : 'https://schema.org',
    '@type'          : 'Article',
    'headline'       : post.title.replace(/ · SSC.*$/, ''), // clean title for schema
    'description'    : post.description,
    'datePublished'  : post.date,
    'author'         : { '@type': 'Organization', 'name': SITE_META.siteName },
    'publisher'      : {
      '@type': 'Organization',
      'name' : SITE_META.siteName,
      'logo' : { '@type': 'ImageObject', 'url': SITE_META.baseUrl + '/ssc-logo.png' }
    },
    'url'            : SITE_META.baseUrl + '/?post=' + post.slug,
    'image'          : post.ogImage || SITE_META.ogImage,
  };

  const script = document.createElement('script');
  script.id   = 'article-jsonld';
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}

function removeArticleJsonLd() {
  const el = document.getElementById('article-jsonld');
  if (el) el.remove();
}


// ────────────────────────────────────────────────────────────
//  PAGE ROUTING
// ────────────────────────────────────────────────────────────

function showPage(name, pushState = true) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  const page = document.getElementById('page-' + name);
  if (page) {
    page.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const navLink = document.getElementById('nav-' + name);
  if (navLink) navLink.classList.add('active');

  // Update meta for this page
  const meta = PAGE_META[name] || {};
  const title = meta.title || (name.charAt(0).toUpperCase() + name.slice(1) + SITE_META.titleSuffix);
  setMeta(title, meta.description || SITE_META.description);
  removeArticleJsonLd();

  // Push URL state
  if (pushState) {
    const url = name === 'home' ? '/' : '/?page=' + name;
    history.pushState({ page: name, post: null }, title, url);
  }
}


// ────────────────────────────────────────────────────────────
//  MOBILE MENU
// ────────────────────────────────────────────────────────────

function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('open');
}


// ────────────────────────────────────────────────────────────
//  BLOG
// ────────────────────────────────────────────────────────────

function openPost(id, pushState = true) {
  document.getElementById('blog-listing').style.display = 'none';
  document.querySelectorAll('.blog-post').forEach(p => p.classList.remove('active'));

  const post = document.getElementById(id);
  if (post) {
    post.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update meta from registry
  const meta = POST_META[id];
  if (meta) {
    const canonicalUrl = SITE_META.baseUrl + '/?post=' + id;
    setMeta(meta.title, meta.description, meta.ogImage, canonicalUrl);
    injectArticleJsonLd(meta);
  }

  // Push URL state
  if (pushState) {
    const title = meta ? meta.title : id;
    history.pushState({ page: 'blog', post: id }, title, '/?post=' + id);
  }
}

function closePosts(pushState = true) {
  document.querySelectorAll('.blog-post').forEach(p => p.classList.remove('active'));
  document.getElementById('blog-listing').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Restore blog page meta
  const meta = PAGE_META['blog'];
  setMeta(meta.title, meta.description);
  removeArticleJsonLd();

  if (pushState) {
    history.pushState({ page: 'blog', post: null }, meta.title, '/?page=blog');
  }
}

function filterBlog(category, btn) {
  document.querySelectorAll('.blog-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const allCards = document.querySelectorAll('#page-blog .blog-card');
  allCards.forEach(card => {
    const show = category === 'all' || card.dataset.category === category;
    card.style.display = show ? 'flex' : 'none';
  });
}


// ────────────────────────────────────────────────────────────
//  POPSTATE — handle browser back/forward
// ────────────────────────────────────────────────────────────

window.addEventListener('popstate', function(e) {
  const state = e.state;
  if (!state) {
    showPage('home', false);
    return;
  }
  if (state.post) {
    // Make sure blog page is visible first
    showPage('blog', false);
    openPost(state.post, false);
  } else if (state.page) {
    showPage(state.page, false);
  } else {
    showPage('home', false);
  }
});


// ────────────────────────────────────────────────────────────
//  DEEP LINK ON LOAD — read URL params on first visit
//  Supports:
//    /?post=post-angel-numbers   → opens blog post directly
//    /?page=calculator           → opens a page directly
// ────────────────────────────────────────────────────────────

function handleDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('post');
  const pageId = params.get('page');

  if (postId && POST_META[postId]) {
    showPage('blog', false);
    openPost(postId, false);
    // Replace state so back button goes to home
    const meta = POST_META[postId];
    history.replaceState({ page: 'blog', post: postId }, meta.title, '/?post=' + postId);
  } else if (pageId && PAGE_META[pageId]) {
    showPage(pageId, false);
    const meta = PAGE_META[pageId];
    history.replaceState({ page: pageId, post: null }, meta.title, '/?page=' + pageId);
  } else {
    // Default: home
    history.replaceState({ page: 'home', post: null }, SITE_META.siteName, '/');
  }
}


// ────────────────────────────────────────────────────────────
//  INIT
// ────────────────────────────────────────────────────────────

function initApp() {
  handleDeepLink();
}


// ────────────────────────────────────────────────────────────
//  EXPOSE to inline HTML onclick attributes
// ────────────────────────────────────────────────────────────

window.toggleMenu  = toggleMenu;
window.showPage    = showPage;
window.openPost    = openPost;
window.closePosts  = closePosts;
window.filterBlog  = filterBlog;


// ────────────────────────────────────────────────────────────
//  FALLBACK: event delegation for calc button
// ────────────────────────────────────────────────────────────

document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('calc-btn')) {
    calculateReading();
  }
});
