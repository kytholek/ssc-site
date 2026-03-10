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
//  4. Done. Routing, meta, URL, schema — all automatic.
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
  blogPath    : '/blog/',   // path to individual post HTML files (absolute from root)
};

// Per-page meta for non-blog pages
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
//  POST CONTAINER
//  One hidden div that receives fetched post HTML.
//  Posts are cached after first load so each is only
//  fetched once per session.
// ────────────────────────────────────────────────────────────
let _postContainer = null;
let _postCache     = {};   // { postId: htmlString }
let _currentPostId = null;

function _getPostContainer() {
  if (!_postContainer) {
    _postContainer = document.getElementById('blog-post-container');
    if (!_postContainer) {
      _postContainer = document.createElement('div');
      _postContainer.id = 'blog-post-container';
      // Insert inside #page-blog, after the listing div
      const blogPage = document.getElementById('page-blog');
      if (blogPage) blogPage.appendChild(_postContainer);
    }
  }
  return _postContainer;
}


// ────────────────────────────────────────────────────────────
//  READ POST META FROM DOM
//  After HTML is injected, reads data-* attributes off the div
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
  // Return from cache if already loaded
  if (_postCache[id]) {
    console.log(`[SSC] Returning cached post: ${id}`);
    return _postCache[id];
  }

  const url = SITE.blogPath + id + '.html';
  console.log(`[SSC] Attempting to fetch post from: ${url}`);
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const html = await res.text();
    console.log(`[SSC] Successfully fetched ${id}, HTML length: ${html.length}`, html.substring(0, 100));
    _postCache[id] = html;
    return html;
  } catch (err) {
    console.error(`[SSC] Failed to load post from ${url}:`, err);
    return null;
  }
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

  const page = document.getElementById('page-' + name);
  if (page) { page.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  const navLink = document.getElementById('nav-' + name);
  if (navLink) navLink.classList.add('active');

  const meta = PAGE_META[name] || { title: name + SITE.titleSuffix, description: SITE.description };
  const url  = name === 'home' ? '/' : '/?page=' + name;
  setMeta(meta.title, meta.description, SITE.ogImage, SITE.baseUrl + url);
  _clearJsonLd();

  if (pushState) history.pushState({ page: name, post: null }, meta.title, url);
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
  console.log(`[SSC] openPost() called with id: ${id}`);
  
  // Show blog page if not already active
  const blogPage = document.getElementById('page-blog');
  if (blogPage && !blogPage.classList.contains('active')) {
    console.log(`[SSC] Showing blog page...`);
    showPage('blog', false);
  }

  const listing   = document.getElementById('blog-listing');
  const container = _getPostContainer();
  
  console.log(`[SSC] Blog listing found: ${!!listing}, Post container found: ${!!container}`);

  // Show loading state
  if (listing)   listing.style.display   = 'none';
  container.style.display = 'block';
  console.log(`[SSC] Container display set to: ${container.style.display}, page-blog display: ${blogPage?.style.display}`);

  // Clear previous post
  if (_currentPostId !== id) {
    container.innerHTML = '<div class="blog-post-loading">Loading…</div>';
  }

  // Fetch (or hit cache)
  console.log(`[SSC] Fetching post HTML...`);
  const html = await _loadPost(id);
  console.log(`[SSC] Post fetch complete. HTML received: ${!!html}`);

  if (!html) {
    console.error(`[SSC] No HTML returned for post: ${id}`);
    container.innerHTML = '<div class="blog-post-error"><p>Could not load this post. <button onclick="closePosts()">← Back to Blog</button></p></div>';
    return;
  }

  // Inject HTML if not already there
  if (_currentPostId !== id) {
    console.log(`[SSC] Injecting HTML into container...`);
    container.innerHTML = html;
    _currentPostId = id;
    
    // Activate the blog post div
    const postEl = container.querySelector(`#${id}`);
    if (postEl) {
      postEl.classList.add('active');
      console.log(`[SSC] Added active class to post element`);
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Read meta from injected DOM
  const postEl = container.querySelector(`#${id}`);
  console.log(`[SSC] Post element found in DOM: ${!!postEl}`);
  
  const meta   = _getPostMeta(postEl, id);
  const canonicalUrl = SITE.baseUrl + '/?post=' + id;

  if (meta) {
    console.log(`[SSC] Post meta found:`, meta);
    setMeta(meta.title, meta.description, meta.ogImage, canonicalUrl);
    _setArticleSchema(meta);
  }

  if (pushState) history.pushState({ page: 'blog', post: id }, meta?.title || id, '/?post=' + id);
}

function closePosts(pushState = true) {
  const listing   = document.getElementById('blog-listing');
  const container = _getPostContainer();

  if (listing)   listing.style.display   = 'block';
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
  document.querySelectorAll('#page-blog .blog-card').forEach(card => {
    card.style.display = (category === 'all' || card.dataset.category === category) ? 'flex' : 'none';
  });
}


// ────────────────────────────────────────────────────────────
//  POPSTATE — browser back / forward
// ────────────────────────────────────────────────────────────
window.addEventListener('popstate', e => {
  const s = e.state;
  if (!s)            { showPage('home', false); return; }
  if (s.post)        { openPost(s.post, false); }
  else if (s.page)     showPage(s.page, false);
  else                 showPage('home', false);
});


// ────────────────────────────────────────────────────────────
//  DEEP LINK ON LOAD
//  /?post=post-666       → fetches + opens that post directly
//  /?page=calculator     → opens that page directly
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
