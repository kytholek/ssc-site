// ══════════════════════════════════════════════════════════════
// SSC ADMIN SYSTEM — Blog CMS
// Access: navigate to #admin in the URL, or press Ctrl+Shift+A,
//         or click the © in the footer 5 times.
// Password: set PASS below
// ══════════════════════════════════════════════════════════════

var adminSystem = (function () {
  'use strict';

  // ── Config ─────────────────────────────────────────────────
  var PASS        = 'ssc2025';
  var STORAGE_KEY = 'ssc-blog-posts';
  var BLOG_PATH   = 'blog/';

  // ── State ──────────────────────────────────────────────────
  var posts     = [];   // dynamic (localStorage) posts
  var editingId = null; // id of dynamic post being edited

  // Currently loaded static post for the editor
  var _staticEditId   = null;  // post id e.g. 'post-666'
  var _staticOrigHTML = '';    // raw fetched HTML (full file)
  var _staticPostEl   = null;  // parsed DOM element

  // ── Post registry (mirrors POST_SEQUENCE in app.js) ────────
  var POST_REGISTRY = [
    { id:'post-simulation',              title:'You Are Running on a Simulation',                       category:'the-system' },
    { id:'post-system',                  title:'The Evolution of Energy: 0 Through 9',                  category:'the-system' },
    { id:'post-electric-magnetic-aether',title:'Electric, Magnetic & Aether: The Three Natures of Number', category:'the-system' },
    { id:'post-codex-architecture',      title:'The Codex: Architecture of the Consciousness Matrix',   category:'the-system' },
    { id:'post-666',                     title:'666 Is Not What You Think',                             category:'the-system' },
    { id:'post-369',                     title:'The 3–6–9 Pattern: Why Tesla Was Right',                category:'the-system' },
    { id:'post-transformation-path',     title:'The Path of Transformation: 1→4→7→2→5→8→3→6→9',       category:'the-system' },
    { id:'post-five-lenses',             title:'The Five Lenses of Self',                               category:'the-system' },
    { id:'post-decoding-matrix',         title:'Decoding the Matrix: The Complete Architecture',        category:'the-system' },
    { id:'post-angel-numbers',           title:'Angel Numbers Are Being Read Wrong',                    category:'the-system' },
    { id:'post-lifepath',                title:'The Life Path Number: Your Primary Frequency',          category:'numerology'  },
    { id:'post-theme-number',            title:"Your Birth Year's Hidden Frequency: The Theme Number",  category:'numerology'  },
    { id:'post-seven',                   title:'Why Seven Frequencies?',                                category:'numerology'  },
    { id:'post-master',                  title:'Master Numbers 11, 22 & 33: Amplified Purpose',         category:'numbers'     },
    { id:'post-pythagorean',             title:'Pythagorean vs. Chaldean Numerology',                   category:'numbers'     },
    { id:'post-shadow',                  title:'The Shadow Side of Your Numbers',                       category:'philosophy'  },
    { id:'post-calculate',               title:'How to Calculate Your Life Path by Hand',               category:'practice'    },
    { id:'post-name',                    title:'Which Name Do You Use?',                                category:'practice'    },
    { id:'post-name-change',             title:'The Name-Changer Dilemma',                              category:'practice'    },
  ];

  // ── Helpers ────────────────────────────────────────────────
  function $(id) { return document.getElementById(id); }

  function escHtml(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function catLabel(cat) {
    return { numerology:'Numerology', philosophy:'Philosophy', numbers:'The Numbers',
             practice:'Practice', 'the-system':'The System' }[cat] || cat;
  }

  function catBadge(cat) {
    var cls = { philosophy:' gold', numbers:' teal', practice:' rose', 'the-system':' gold' };
    return '<span class="blog-tag' + (cls[cat]||'') + '">' + catLabel(cat) + '</span>';
  }

  function catGlyph(cat) {
    return { numerology:'&#9732;', philosophy:'&#10022;', numbers:'&#9651;',
             practice:'&#9998;', 'the-system':'0→9' }[cat] || '&#10022;';
  }

  function showToast(msg, type) {
    var t = $('admin-toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'admin-toast show' + (type === 'error' ? ' toast-error' : type === 'ok' ? ' toast-ok' : '');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('show'); }, 3200);
  }

  function formatDate(d) {
    var m = ['January','February','March','April','May','June','July',
             'August','September','October','November','December'];
    return m[d.getMonth()] + ' ' + d.getFullYear();
  }

  // ── Markdown ↔ HTML ────────────────────────────────────────
  function markdownToHtml(md) {
    var lines = (md || '').split('\n');
    var html = '', inPara = false;
    function closePara() { if (inPara) { html += '</p>\n'; inPara = false; } }
    lines.forEach(function (line) {
      line = line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      var trimmed = line.trim();
      if (/^!\[/.test(trimmed)) {
        closePara();
        var m = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
        if (m) html += '<img src="' + m[2] + '" alt="' + m[1] + '" style="max-width:100%;border-radius:4px;margin:16px 0;display:block"/>\n';
        return;
      }
      if (/^#{1,3}\s/.test(trimmed)) {
        closePara();
        html += '<h3>' + inlineFmt(trimmed.replace(/^#+\s/, '')) + '</h3>\n';
        return;
      }
      if (/^>\s/.test(trimmed)) {
        closePara();
        html += '<blockquote>' + inlineFmt(trimmed.slice(2)) + '</blockquote>\n';
        return;
      }
      if (!trimmed) { closePara(); return; }
      if (!inPara) { html += '<p>'; inPara = true; } else { html += ' '; }
      html += inlineFmt(trimmed);
    });
    closePara();
    return html;
  }

  function inlineFmt(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
  }

  // Convert simple post HTML content back to editable markdown-ish text
  function htmlToEditable(html) {
    return (html || '')
      .replace(/<h3>(.*?)<\/h3>/gi, '\n### $1\n')
      .replace(/<blockquote>(.*?)<\/blockquote>/gi, '\n> $1\n')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<p>([\s\S]*?)<\/p>/gi, '\n$1\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#8594;/g, '→')
      .replace(/&#8592;/g, '←')
      .replace(/&middot;/g, '·')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  // ── Auth ───────────────────────────────────────────────────
  function open() {
    var overlay = $('admin-overlay');
    if (!overlay) return;
    overlay.classList.add('open');
    if (sessionStorage.getItem('ssc-admin-auth') === '1') {
      showPanel();
    } else {
      $('admin-login').style.display = 'flex';
      $('admin-panel').classList.remove('open');
      setTimeout(function () { var i = $('admin-pass-input'); if (i) i.focus(); }, 100);
    }
  }

  function close() {
    var overlay = $('admin-overlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function login() {
    var val = ($('admin-pass-input').value || '').trim();
    var err = $('admin-login-error');
    if (val === PASS) {
      sessionStorage.setItem('ssc-admin-auth', '1');
      $('admin-pass-input').value = '';
      err.textContent = '';
      showPanel();
    } else {
      err.textContent = 'Incorrect passphrase.';
      $('admin-pass-input').value = '';
      $('admin-pass-input').focus();
    }
  }

  function showPanel() {
    $('admin-login').style.display = 'none';
    $('admin-panel').classList.add('open');
    document.body.style.overflow = 'hidden';
    loadPosts();
    renderPostsList();
    renderDynamicPosts();
    renderStaticPostList();
  }

  // ── Tab routing ────────────────────────────────────────────
  function switchTab(name) {
    document.querySelectorAll('.admin-tab').forEach(function (t) { t.classList.remove('active'); });
    document.querySelectorAll('.admin-tab-btn').forEach(function (b) { b.classList.remove('active'); });
    var tab = $('tab-' + name);
    var btn = $('tab-btn-' + name);
    if (tab) tab.classList.add('active');
    if (btn) btn.classList.add('active');
    if (name === 'preview') buildPreview();
    if (name === 'posts')   renderPostsList();
    if (name === 'edit')    renderStaticPostList();
    if (name === 'export')  {} // nothing to auto-run
  }

  // ── Write tab (dynamic posts) ──────────────────────────────
  function wrap(before, after, mode) {
    var ta = $('admin-body');
    var start = ta.selectionStart, end = ta.selectionEnd;
    var sel = ta.value.substring(start, end);
    var replacement = (mode === 'heading' || mode === 'quote')
      ? before + (sel || 'Text here')
      : before + (sel || 'text') + after;
    ta.value = ta.value.substring(0, start) + replacement + ta.value.substring(end);
    ta.focus();
    ta.selectionStart = start + before.length;
    ta.selectionEnd   = start + replacement.length - after.length;
  }

  function insertBreak() {
    var ta = $('admin-body');
    var pos = ta.selectionStart;
    ta.value = ta.value.substring(0, pos) + '\n\n' + ta.value.substring(pos);
    ta.selectionStart = ta.selectionEnd = pos + 2;
    ta.focus();
  }

  function insertImage() {
    var url = prompt('Paste the image URL:');
    if (!url) return;
    var alt = prompt('Image description (optional):') || '';
    var ta  = $('admin-body');
    var pos = ta.selectionStart;
    var tag = '\n![' + alt + '](' + url + ')\n';
    ta.value = ta.value.substring(0, pos) + tag + ta.value.substring(pos);
    ta.selectionStart = ta.selectionEnd = pos + tag.length;
    ta.focus();
  }

  function buildPreview() {
    var title    = ($('admin-title').value    || '').trim();
    var category = $('admin-category').value;
    var date     = ($('admin-date').value     || '').trim();
    var body     = $('admin-body').value;
    var el       = $('admin-preview-content');
    if (!title && !body) {
      el.innerHTML = '<div class="admin-empty">Fill in the Write tab to see a preview.</div>';
      return;
    }
    var readTime = Math.max(1, Math.round(body.split(/\s+/).length / 200));
    el.innerHTML =
      '<div class="blog-post-eyebrow">' + catBadge(category) + '</div>' +
      '<h1 class="preview-banner">' + escHtml(title || 'Untitled') + '</h1>' +
      '<div class="preview-meta">' +
        '<span class="blog-date">' + (date || 'Draft') + '</span>' +
        '<span style="color:var(--text-muted)">&middot;</span>' +
        '<span class="blog-date">' + readTime + ' min read</span>' +
      '</div>' +
      '<div class="preview-body">' + markdownToHtml(body) + '</div>';
  }

  function previewCardImage(url) {
    var p = $('admin-image-preview');
    if (!p) return;
    if (url && url.startsWith('http')) {
      p.style.display = 'block';
      p.style.backgroundImage = 'url(' + url + ')';
    } else {
      p.style.display = 'none';
      p.style.backgroundImage = '';
    }
  }

  // ── Dynamic posts (localStorage) ──────────────────────────
  function loadPosts() {
    try { var raw = localStorage.getItem(STORAGE_KEY); posts = raw ? JSON.parse(raw) : []; }
    catch (e) { posts = []; }
  }

  function savePosts() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); }
    catch (e) { showToast('Storage error — posts may not persist', 'error'); }
  }

  function publish() {
    var title    = ($('admin-title').value    || '').trim();
    var category = $('admin-category').value;
    var date     = ($('admin-date').value     || '').trim() || formatDate(new Date());
    var excerpt  = ($('admin-excerpt').value  || '').trim();
    var body     = ($('admin-body').value     || '').trim();
    var image    = ($('admin-image').value    || '').trim();
    var idInput  = $('admin-editing-id').value;
    if (!title) { showToast('Please add a title first.', 'error'); return; }
    if (!body)  { showToast('Please write some content.', 'error'); return; }
    loadPosts();
    if (idInput) {
      var idx = posts.findIndex(function (p) { return p.id === idInput; });
      if (idx >= 0) posts[idx] = { id:idInput, title:title, category:category, date:date, excerpt:excerpt, body:body, image:image };
    } else {
      posts.push({ id:'dyn-' + Date.now(), title:title, category:category, date:date, excerpt:excerpt, body:body, image:image });
    }
    savePosts();
    renderDynamicPosts();
    renderPostsList();
    clearForm();
    showToast(idInput ? 'Post updated!' : 'Post published!', 'ok');
    switchTab('posts');
  }

  function editDynPost(id) {
    var post = posts.find(function (p) { return p.id === id; });
    if (!post) return;
    $('admin-editing-id').value = id;
    $('admin-title').value    = post.title;
    $('admin-category').value = post.category;
    $('admin-date').value     = post.date;
    $('admin-excerpt').value  = post.excerpt || '';
    $('admin-body').value     = post.body;
    $('admin-image').value    = post.image || '';
    switchTab('write');
  }

  function deleteDynPost(id) {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    posts = posts.filter(function (p) { return p.id !== id; });
    savePosts();
    renderDynamicPosts();
    renderPostsList();
    showToast('Post deleted.');
  }

  function clearForm() {
    $('admin-editing-id').value = '';
    $('admin-title').value    = '';
    $('admin-category').value = 'numerology';
    $('admin-date').value     = '';
    $('admin-excerpt').value  = '';
    $('admin-body').value     = '';
    $('admin-image').value    = '';
    editingId = null;
  }

  function renderDynamicPosts() {
    document.querySelectorAll('.dyn-blog-card, .dyn-blog-post').forEach(function (el) { el.remove(); });
    var grid = $('blog-grid');
    if (!grid) return;
    posts.forEach(function (post) {
      var card = document.createElement('div');
      card.className = 'blog-card dyn-blog-card';
      card.setAttribute('data-category', post.category);
      card.onclick = function () { openDynPost(post.id); };
      var isSystem = post.category === 'the-system';
      var bannerStyle = (!isSystem && post.image)
        ? 'height:120px;background-image:url(' + escHtml(post.image) + ');background-size:cover;background-position:center;'
        : 'height:120px';
      var glyphHtml = (!isSystem && post.image) ? '' : '<div class="blog-card-glyph' + (isSystem ? ' system-glyph' : '') + '" style="font-size:38px">' + catGlyph(post.category) + '</div>';
      if (isSystem) card.classList.add('blog-card-system');
      card.innerHTML =
        '<div class="blog-card-banner' + (isSystem ? ' blog-card-banner-system' : '') + '" style="' + bannerStyle + '">' + glyphHtml + '</div>' +
        '<div class="blog-card-body">' +
          '<div class="blog-card-meta">' + catBadge(post.category) + '<span class="blog-date">' + post.date + '</span></div>' +
          '<div class="blog-card-title">' + escHtml(post.title) + '</div>' +
          (post.excerpt ? '<p class="blog-card-excerpt">' + escHtml(post.excerpt) + '</p>' : '') +
          '<div class="blog-read-more">Read Article &#8594;</div>' +
        '</div>';
      grid.appendChild(card);

      var article = document.createElement('div');
      article.className = 'blog-post dyn-blog-post';
      article.id = 'dyn-post-' + post.id;
      var readTime = Math.max(1, Math.round(post.body.split(/\s+/).length / 200));
      article.innerHTML =
        '<button class="blog-post-back" onclick="closePosts()">&#8592; Back to Blog</button>' +
        '<div class="blog-post-eyebrow">' + catBadge(post.category) + '</div>' +
        '<h1 class="blog-post-title">' + escHtml(post.title) + '</h1>' +
        '<div class="blog-post-meta">' + escHtml(post.date) + ' &middot; ' + readTime + ' min read</div>' +
        '<div class="blog-post-content">' + markdownToHtml(post.body) + '</div>';
      var blogPage = $('page-blog');
      if (blogPage) blogPage.appendChild(article);
    });
  }

  function openDynPost(id) {
    $('blog-listing').style.display = 'none';
    document.querySelectorAll('.blog-post').forEach(function (p) { p.classList.remove('active'); });
    var post = $('dyn-post-' + id);
    if (post) { post.classList.add('active'); window.scrollTo({ top:0, behavior:'smooth' }); }
  }

  function renderPostsList() {
    var container = $('admin-posts-list-inner');
    if (!container) return;
    if (!posts.length) {
      container.innerHTML = '<div class="admin-empty">No dynamic posts yet. Write one in the Write tab.</div>';
      return;
    }
    container.innerHTML = posts.slice().reverse().map(function (post) {
      return (
        '<div class="admin-post-item">' +
          '<div class="admin-post-info">' +
            '<div class="admin-post-title">' + escHtml(post.title) + '</div>' +
            '<div class="admin-post-meta">' + catBadge(post.category) + ' &nbsp;' + escHtml(post.date) + '</div>' +
          '</div>' +
          '<div class="admin-post-btns">' +
            '<button class="admin-post-edit"   onclick="adminSystem.editDynPost(\'' + post.id + '\')">Edit</button>' +
            '<button class="admin-post-delete" onclick="adminSystem.deleteDynPost(\'' + post.id + '\')">Delete</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  // ── STATIC POST EDITOR ─────────────────────────────────────
  // Lists all static posts from POST_REGISTRY.
  // User clicks a post → we fetch the file → parse into editable fields.
  // On save → regenerate the HTML file → trigger a download.

  function renderStaticPostList() {
    var list = $('static-post-list');
    if (!list) return;
    list.innerHTML = POST_REGISTRY.map(function (p) {
      var badge = catBadge(p.category);
      return (
        '<div class="admin-post-item static-post-item" id="spi-' + p.id + '">' +
          '<div class="admin-post-info">' +
            '<div class="admin-post-title">' + escHtml(p.title) + '</div>' +
            '<div class="admin-post-meta">' + badge + '</div>' +
          '</div>' +
          '<div class="admin-post-btns">' +
            '<button class="admin-post-edit" onclick="adminSystem.loadStaticPost(\'' + p.id + '\')">Edit</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function loadStaticPost(id) {
    // Show loading state
    var pane = $('static-editor-pane');
    var list = $('static-post-list-wrap');
    var loading = $('static-loading');

    if (pane)    pane.style.display    = 'none';
    if (loading) { loading.style.display = 'flex'; loading.textContent = 'Fetching ' + id + '.html…'; }

    fetch(BLOG_PATH + id + '.html?v=' + Date.now())
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (html) {
        _staticEditId   = id;
        _staticOrigHTML = html;
        _populateStaticEditor(id, html);
        if (loading) loading.style.display = 'none';
        if (pane)    pane.style.display    = 'flex';
        if (list)    list.style.display    = 'none';
      })
      .catch(function (err) {
        if (loading) loading.style.display = 'none';
        showToast('Could not load ' + id + '.html — is the dev server running?', 'error');
        console.error('[SSC Admin]', err);
      });
  }

  function _populateStaticEditor(id, rawHtml) {
    // Parse the fetched HTML into a temporary DOM
    var parser = new DOMParser();
    var doc    = parser.parseFromString('<html><body>' + rawHtml + '</body></html>', 'text/html');
    var postEl = doc.querySelector('.blog-post[id]');

    if (!postEl) {
      showToast('Could not parse post structure — edit the raw HTML directly.', 'error');
      // Fall back to raw mode
      var rawArea = $('static-raw-html');
      if (rawArea) { rawArea.value = rawHtml; rawArea.style.display = 'block'; }
      var pane = $('static-editor-pane');
      if (pane) pane.style.display = 'flex';
      return;
    }

    _staticPostEl = postEl;

    // Populate fields
    var titleInput = $('static-title');
    var descInput  = $('static-desc');
    var dateInput  = $('static-date');
    var catSelect  = $('static-category');
    var bodyArea   = $('static-body');
    var rawArea    = $('static-raw-html');

    if (titleInput) titleInput.value = postEl.dataset.title       || '';
    if (descInput)  descInput.value  = postEl.dataset.description || '';
    if (dateInput)  dateInput.value  = postEl.dataset.date        || '';

    // Try to match category from registry
    var reg = POST_REGISTRY.find(function (p) { return p.id === id; });
    if (catSelect && reg) catSelect.value = reg.category;

    // Extract the .blog-post-content innerHTML for editing
    var contentEl = postEl.querySelector('.blog-post-content');
    var rawContent = contentEl ? contentEl.innerHTML : '';

    // Offer both editable (simplified) and raw modes
    if (bodyArea) bodyArea.value = htmlToEditable(rawContent);
    if (rawArea)  rawArea.value  = rawContent;

    // Update the editor header
    var header = $('static-editor-title');
    if (header) header.textContent = postEl.dataset.title || id;

    // Show the correct mode panel
    _showStaticMode('visual');
  }

  function _showStaticMode(mode) {
    var visualPane = $('static-visual-mode');
    var rawPane    = $('static-raw-mode');
    var modeBtns   = document.querySelectorAll('.static-mode-btn');

    modeBtns.forEach(function (b) {
      b.classList.toggle('active', b.dataset.mode === mode);
    });

    if (visualPane) visualPane.style.display = mode === 'visual' ? 'block' : 'none';
    if (rawPane)    rawPane.style.display    = mode === 'raw'    ? 'block' : 'none';
  }

  function switchStaticMode(mode) {
    // If switching to raw, sync body → raw
    if (mode === 'raw') {
      var bodyArea = $('static-body');
      var rawArea  = $('static-raw-html');
      if (bodyArea && rawArea) {
        rawArea.value = markdownToHtml(bodyArea.value);
      }
    }
    // If switching to visual, sync raw → body
    if (mode === 'visual') {
      var rawArea  = $('static-raw-html');
      var bodyArea = $('static-body');
      if (rawArea && bodyArea) {
        bodyArea.value = htmlToEditable(rawArea.value);
      }
    }
    _showStaticMode(mode);
  }

  function staticWrap(before, after, mode) {
    var ta = $('static-body');
    if (!ta) return;
    var start = ta.selectionStart, end = ta.selectionEnd;
    var sel = ta.value.substring(start, end);
    var replacement = (mode === 'heading' || mode === 'quote')
      ? before + (sel || 'Text here')
      : before + (sel || 'text') + after;
    ta.value = ta.value.substring(0, start) + replacement + ta.value.substring(end);
    ta.focus();
    ta.selectionStart = start + before.length;
    ta.selectionEnd   = start + replacement.length - after.length;
  }

  function staticInsertBreak() {
    var ta = $('static-body');
    if (!ta) return;
    var pos = ta.selectionStart;
    ta.value = ta.value.substring(0, pos) + '\n\n' + ta.value.substring(pos);
    ta.selectionStart = ta.selectionEnd = pos + 2;
    ta.focus();
  }

  function previewStaticPost() {
    var title   = ($('static-title').value || '').trim();
    var body    = $('static-body').value;
    var rawMode = $('static-raw-mode') && $('static-raw-mode').style.display !== 'none';
    var content = rawMode ? $('static-raw-html').value : markdownToHtml(body);
    var preview = $('static-preview-content');
    if (!preview) return;
    var readTime = Math.max(1, Math.round(content.replace(/<[^>]+>/g,'').split(/\s+/).length / 200));
    preview.innerHTML =
      '<h1 class="blog-post-title">' + escHtml(title) + '</h1>' +
      '<div class="blog-post-meta">' + readTime + ' min read</div>' +
      '<div class="blog-post-content">' + content + '</div>';
    _showStaticMode('preview');
  }

  function saveStaticPost() {
    if (!_staticEditId || !_staticOrigHTML) {
      showToast('No post loaded.', 'error');
      return;
    }

    var title    = ($('static-title').value || '').trim();
    var desc     = ($('static-desc').value  || '').trim();
    var date     = ($('static-date').value  || '').trim();
    var rawPane  = $('static-raw-mode');
    var isRaw    = rawPane && rawPane.style.display !== 'none';
    var newContent = isRaw
      ? $('static-raw-html').value
      : markdownToHtml($('static-body').value);

    if (!title) { showToast('Title cannot be empty.', 'error'); return; }

    // Rebuild the post HTML by modifying the data attributes and content block
    // We parse the original HTML, patch it, and serialise it back
    var parser = new DOMParser();
    var doc    = parser.parseFromString('<html><body>' + _staticOrigHTML + '</body></html>', 'text/html');
    var postEl = doc.querySelector('.blog-post[id]');

    if (!postEl) {
      showToast('Cannot find post element — saving raw HTML as-is.', 'error');
      _downloadFile(_staticEditId + '.html', _staticOrigHTML);
      return;
    }

    // Update data attributes
    postEl.dataset.title       = title;
    postEl.dataset.description = desc;
    postEl.dataset.date        = date;

    // Update content div
    var contentEl = postEl.querySelector('.blog-post-content');
    if (contentEl) contentEl.innerHTML = '\n      ' + newContent + '\n    ';

    // Update the h1 title inside the post
    var h1 = postEl.querySelector('.blog-post-title');
    if (h1) h1.textContent = title;

    // Serialise the body back (just the inner HTML of body, preserving comments)
    var bodyEl   = doc.querySelector('body');
    var outputHtml = bodyEl ? bodyEl.innerHTML : _staticOrigHTML;

    // Prepend original file comments if present
    var comments = _staticOrigHTML.match(/^(<!--[\s\S]*?-->\s*)+/);
    var header   = comments ? comments[0] : '';
    var finalHtml = header + outputHtml.replace(/^\s*/, '');

    _downloadFile(_staticEditId + '.html', finalHtml);
    showToast('✓ ' + _staticEditId + '.html downloaded — replace the file in /blog/', 'ok');
  }

  function _downloadFile(filename, content) {
    var blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1000);
  }

  function closeStaticEditor() {
    _staticEditId   = null;
    _staticOrigHTML = '';
    _staticPostEl   = null;
    var pane = $('static-editor-pane');
    var list = $('static-post-list-wrap');
    if (pane) pane.style.display = 'none';
    if (list) list.style.display = 'block';
    _showStaticMode('visual');
  }

  // ── Export ─────────────────────────────────────────────────
  function exportCode() {
    loadPosts();
    if (!posts.length) { showToast('No dynamic posts to export yet.'); return; }
    var cls = { philosophy:' gold', numbers:' teal', practice:' rose', 'the-system':' gold' };

    var cardsHtml = posts.map(function (post) {
      var tag = '<span class=\\"blog-tag' + (cls[post.category]||'') + '\\">' + catLabel(post.category) + '</span>';
      var banner = post.image
        ? '  <div class="blog-card-banner" style="height:120px;background-image:url(' + post.image + ');background-size:cover;background-position:center"></div>'
        : '  <div class="blog-card-banner" style="height:120px"><div class="blog-card-glyph" style="font-size:38px">' + catGlyph(post.category) + '</div></div>';
      return [
        '<div class="blog-card" onclick="openPost(\'' + post.id + '\')" data-category="' + post.category + '">',
        banner,
        '  <div class="blog-card-body">',
        '    <div class="blog-card-meta">' + tag + '<span class="blog-date">' + escHtml(post.date) + '</span></div>',
        '    <div class="blog-card-title">' + escHtml(post.title) + '</div>',
        (post.excerpt ? '    <p class="blog-card-excerpt">' + escHtml(post.excerpt) + '</p>' : ''),
        '    <div class="blog-read-more">Read Article &#8594;</div>',
        '  </div>',
        '</div>',
      ].filter(Boolean).join('\n');
    }).join('\n\n');

    var postsHtml = posts.map(function (post) {
      var readTime = Math.max(1, Math.round(post.body.split(/\s+/).length / 200));
      var tag = '<span class=\\"blog-tag' + (cls[post.category]||'') + '\\">' + catLabel(post.category) + '</span>';
      return [
        '<div class="blog-post" id="' + post.id + '">',
        '  <button class="blog-post-back" onclick="closePosts()">&#8592; Back to Blog</button>',
        '  <div class="blog-post-eyebrow">' + tag + '</div>',
        '  <h1 class="blog-post-title">' + escHtml(post.title) + '</h1>',
        '  <div class="blog-post-meta">' + escHtml(post.date) + ' &middot; ' + readTime + ' min read</div>',
        '  <div class="blog-post-content">',
        '    ' + markdownToHtml(post.body).replace(/\n/g, '\n    '),
        '  </div>',
        '</div>',
      ].join('\n');
    }).join('\n\n');

    var out = '<!-- PASTE CARDS into #blog-grid -->\n' + cardsHtml +
              '\n\n<!-- PASTE POSTS before closing </div> of page-blog -->\n' + postsHtml;
    $('admin-export-output').value = out;
    showToast('Export ready — copy and paste into blog.html');
  }

  // ── Boot ───────────────────────────────────────────────────
  function boot() {
    loadPosts();
    if (posts.length) renderDynamicPosts();

    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') { e.preventDefault(); open(); }
    });

    function checkHash() {
      if (window.location.hash === '#admin') { window.location.hash = ''; open(); }
    }
    checkHash();
    window.addEventListener('hashchange', checkHash);

    var triggerClicks = 0, triggerTimer = null;
    var trigger = $('admin-trigger');
    if (trigger) {
      trigger.addEventListener('click', function () {
        triggerClicks++;
        clearTimeout(triggerTimer);
        if (triggerClicks >= 5) { triggerClicks = 0; open(); }
        else { triggerTimer = setTimeout(function () { triggerClicks = 0; }, 1200); }
      });
    }

    var overlay = $('admin-overlay');
    if (overlay) {
      overlay.addEventListener('click', function (e) { if (e.target === this) close(); });
    }
  }

  // ── Public API ─────────────────────────────────────────────
  return {
    open, close, login, boot,
    switchTab,
    // Write tab
    wrap, insertBreak, insertImage,
    buildPreview, previewCardImage,
    publish, clearForm,
    // Dynamic posts tab
    editDynPost, deleteDynPost,
    // Static post editor
    loadStaticPost, closeStaticEditor,
    switchStaticMode, staticWrap, staticInsertBreak,
    previewStaticPost, saveStaticPost,
    // Export
    exportCode,
  };

})();

// Boot is called by index.html onAllLoaded() after all fragments are injected.
