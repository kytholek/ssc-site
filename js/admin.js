// ══════════════════════════════════════════════════════════════
// SSC ADMIN SYSTEM — Blog CMS
// Access: navigate to #admin in the URL, or press Ctrl+Shift+A
// Password: set PASS below
// ══════════════════════════════════════════════════════════════

var adminSystem = (function () {
  'use strict';

  var PASS = 'ssc2025';
  var STORAGE_KEY = 'ssc-blog-posts';
  var posts = [];
  var editingId = null;

  function loadPosts() {
    try { var raw = localStorage.getItem(STORAGE_KEY); posts = raw ? JSON.parse(raw) : []; }
    catch (e) { posts = []; }
  }

  function savePosts() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); }
    catch (e) { showToast('Storage error — posts may not persist'); }
  }

  function open() {
    var overlay = document.getElementById('admin-overlay');
    if (!overlay) { console.warn('SSC Admin: overlay element not found'); return; }
    overlay.classList.add('open');
    if (sessionStorage.getItem('ssc-admin-auth') === '1') {
      showPanel();
    } else {
      document.getElementById('admin-login').style.display = 'flex';
      document.getElementById('admin-panel').classList.remove('open');
      setTimeout(function () {
        var inp = document.getElementById('admin-pass-input');
        if (inp) inp.focus();
      }, 100);
    }
  }

  function close() {
    var overlay = document.getElementById('admin-overlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showPanel() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').classList.add('open');
    document.body.style.overflow = 'hidden';
    loadPosts();
    renderPostsList();
    renderDynamicPosts();
  }

  function login() {
    var val = (document.getElementById('admin-pass-input').value || '').trim();
    var err = document.getElementById('admin-login-error');
    if (val === PASS) {
      sessionStorage.setItem('ssc-admin-auth', '1');
      document.getElementById('admin-pass-input').value = '';
      err.textContent = '';
      showPanel();
    } else {
      err.textContent = 'Incorrect passphrase.';
      document.getElementById('admin-pass-input').value = '';
      document.getElementById('admin-pass-input').focus();
    }
  }

  function switchTab(name) {
    document.querySelectorAll('.admin-tab').forEach(function (t) { t.classList.remove('active'); });
    document.querySelectorAll('.admin-tab-btn').forEach(function (b) { b.classList.remove('active'); });
    var tab = document.getElementById('tab-' + name);
    var btn = document.getElementById('tab-btn-' + name);
    if (tab) tab.classList.add('active');
    if (btn) btn.classList.add('active');
    if (name === 'preview') buildPreview();
    if (name === 'posts')   renderPostsList();
  }

  function wrap(before, after, mode) {
    var ta = document.getElementById('admin-body');
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
    var ta = document.getElementById('admin-body');
    var pos = ta.selectionStart;
    ta.value = ta.value.substring(0, pos) + '\n\n' + ta.value.substring(pos);
    ta.selectionStart = ta.selectionEnd = pos + 2;
    ta.focus();
  }

  function markdownToHtml(md) {
    var lines = (md || '').split('\n');
    var html = '', inPara = false;
    function closePara() { if (inPara) { html += '</p>\n'; inPara = false; } }
    lines.forEach(function (line) {
      line = line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      var trimmed = line.trim();
      // Inline image: ![alt](url)
      if (/^!\[/.test(trimmed)) {
        closePara();
        var imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
        if (imgMatch) {
          html += '<img src="' + imgMatch[2] + '" alt="' + imgMatch[1] + '" style="max-width:100%;border-radius:4px;margin:16px 0;display:block"/>' + '\n';
        }
        return;
      }
      if (/^#{1,3}\s/.test(trimmed)) {
        closePara();
        html += '<h3>' + inlineFormat(trimmed.replace(/^#+\s/,'')) + '</h3>\n';
        return;
      }
      if (/^>\s/.test(trimmed)) {
        closePara();
        html += '<blockquote>' + inlineFormat(trimmed.slice(2)) + '</blockquote>\n';
        return;
      }
      if (!trimmed) { closePara(); return; }
      if (!inPara) { html += '<p>'; inPara = true; } else { html += ' '; }
      html += inlineFormat(trimmed);
    });
    closePara();
    return html;
  }

  function inlineFormat(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
  }

  function categoryBadge(cat) {
    var labels = { numerology:'Numerology', philosophy:'Philosophy', numbers:'The Numbers', practice:'Practice', 'the-system':'The System' };
    var cls    = { philosophy:' gold', numbers:' teal', practice:' rose', 'the-system':' teal' };
    return '<span class="blog-tag' + (cls[cat]||'') + '">' + (labels[cat]||cat) + '</span>';
  }

  function categoryGlyph(cat) {
    return { numerology:'&#9732;', philosophy:'&#10022;', numbers:'&#9651;', practice:'&#9998;', 'the-system':'0→9' }[cat] || '&#10022;';
  }

  function buildPreview() {
    var title    = (document.getElementById('admin-title').value    || '').trim();
    var category = document.getElementById('admin-category').value;
    var date     = (document.getElementById('admin-date').value     || '').trim();
    var body     = document.getElementById('admin-body').value;
    var el       = document.getElementById('admin-preview-content');
    if (!title && !body) {
      el.innerHTML = '<div class="admin-empty">Fill in the Write tab to see a preview.</div>';
      return;
    }
    var readTime = Math.max(1, Math.round(body.split(/\s+/).length / 200));
    el.innerHTML =
      '<div class="blog-post-eyebrow">' + categoryBadge(category) + '</div>' +
      '<h1 class="preview-banner">' + (title || 'Untitled') + '</h1>' +
      '<div class="preview-meta">' +
        '<span class="blog-date">' + (date || 'Draft') + '</span>' +
        '<span style="color:var(--text-muted)">&middot;</span>' +
        '<span class="blog-date">' + readTime + ' min read</span>' +
      '</div>' +
      '<div class="preview-body">' + markdownToHtml(body) + '</div>';
  }

  function publish() {
    var title    = (document.getElementById('admin-title').value    || '').trim();
    var category = document.getElementById('admin-category').value;
    var date     = (document.getElementById('admin-date').value     || '').trim() || formatDate(new Date());
    var excerpt  = (document.getElementById('admin-excerpt').value  || '').trim();
    var body     = (document.getElementById('admin-body').value     || '').trim();
    var image    = (document.getElementById('admin-image').value    || '').trim();
    var idInput  = document.getElementById('admin-editing-id').value;
    if (!title) { showToast('Please add a title first.'); return; }
    if (!body)  { showToast('Please write some content.'); return; }
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
    showToast(idInput ? 'Post updated!' : 'Post published!');
    switchTab('posts');
  }

  function formatDate(d) {
    var m = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return m[d.getMonth()] + ' ' + d.getFullYear();
  }

  function editPost(id) {
    var post = posts.find(function (p) { return p.id === id; });
    if (!post) return;
    document.getElementById('admin-editing-id').value = id;
    document.getElementById('admin-title').value    = post.title;
    document.getElementById('admin-category').value = post.category;
    document.getElementById('admin-date').value     = post.date;
    document.getElementById('admin-excerpt').value  = post.excerpt || '';
    document.getElementById('admin-body').value     = post.body;
    document.getElementById('admin-image').value    = post.image || '';
    switchTab('write');
  }

  function deletePost(id) {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    posts = posts.filter(function (p) { return p.id !== id; });
    savePosts();
    renderDynamicPosts();
    renderPostsList();
    showToast('Post deleted.');
  }

  function clearForm() {
    document.getElementById('admin-editing-id').value = '';
    document.getElementById('admin-title').value    = '';
    document.getElementById('admin-category').value = 'numerology';
    document.getElementById('admin-date').value     = '';
    document.getElementById('admin-excerpt').value  = '';
    document.getElementById('admin-body').value     = '';
    document.getElementById('admin-image').value    = '';
    editingId = null;
  }

  function renderDynamicPosts() {
    document.querySelectorAll('.dyn-blog-card, .dyn-blog-post').forEach(function (el) { el.remove(); });
    var grid = document.getElementById('blog-grid');
    if (!grid) return;
    posts.forEach(function (post) {
      var card = document.createElement('div');
      card.className = 'blog-card dyn-blog-card';
      card.setAttribute('data-category', post.category);
      card.onclick = function () { openDynPost(post.id); };
      var isSystem = post.category === 'the-system';
      var bannerClass = isSystem ? 'blog-card-banner blog-card-banner-system' : 'blog-card-banner';
      var bannerStyle = (!isSystem && post.image)
        ? 'height:120px;background-image:url(' + escHtml(post.image) + ');background-size:cover;background-position:center;'
        : 'height:120px';
      var glyphClass  = isSystem ? 'blog-card-glyph system-glyph' : 'blog-card-glyph';
      var glyphHtml   = (!isSystem && post.image) ? '' : '<div class="' + glyphClass + '" style="font-size:38px">' + categoryGlyph(post.category) + '</div>';
      if (isSystem) card.classList.add('blog-card-system');
      card.innerHTML =
        '<div class="' + bannerClass + '" style="' + bannerStyle + '">' +
          glyphHtml +
        '</div>' +
        '<div class="blog-card-body">' +
          '<div class="blog-card-meta">' + categoryBadge(post.category) + '<span class="blog-date">' + post.date + '</span></div>' +
          '<div class="blog-card-title">' + escHtml(post.title) + '</div>' +
          (post.excerpt ? '<p class="blog-card-excerpt">' + escHtml(post.excerpt) + '</p>' : '') +
          '<div class="blog-read-more">Read Article &#8594;</div>' +
        '</div>';
      grid.appendChild(card);

      var article = document.createElement('div');
      article.className = 'blog-post dyn-blog-post';
      article.id = 'dyn-post-' + post.id;
      var readTime = Math.max(1, Math.round(post.body.split(/\s+/).length / 200));
      var bookPromo = post.category === 'the-system' ? (
        '<div class="system-book-promo">' +
          '<div class="system-book-promo-eyebrow">Simulation Source Code · Coming Soon</div>' +
          '<div class="system-book-promo-title">Simulation Source Code: A Complete Guide to the Numerical Architecture of Reality</div>' +
          '<p class="system-book-promo-body">The complete written work — Simulation Theory, Numerology and Spirituality, all in one. The full map of the simulation, in print.</p>' +
          '<a href="#" class="system-book-promo-btn" onclick="alert(&apos;Coming soon — join the list for early access.&apos;);return false;">&#10022;&nbsp; Join the Early Access List &nbsp;&#10022;</a>' +
        '</div>'
      ) : '';
      article.innerHTML =
        '<button class="blog-post-back" onclick="closePosts()">&#8592; Back to Blog</button>' +
        '<div class="blog-post-eyebrow">' + categoryBadge(post.category) + '</div>' +
        '<h1 class="blog-post-title">' + escHtml(post.title) + '</h1>' +
        '<div class="blog-post-meta">' + escHtml(post.date) + ' &middot; ' + readTime + ' min read</div>' +
        '<div class="blog-post-content">' + markdownToHtml(post.body) + '</div>' +
        bookPromo;
      var blogPage = document.getElementById('page-blog');
      if (blogPage) blogPage.appendChild(article);
    });
  }

  function openDynPost(id) {
    document.getElementById('blog-listing').style.display = 'none';
    document.querySelectorAll('.blog-post').forEach(function (p) { p.classList.remove('active'); });
    var post = document.getElementById('dyn-post-' + id);
    if (post) { post.classList.add('active'); window.scrollTo({ top:0, behavior:'smooth' }); }
  }

  function renderPostsList() {
    var container = document.getElementById('admin-posts-list-inner');
    if (!container) return;
    if (!posts.length) {
      container.innerHTML = '<div class="admin-empty">No dynamic posts yet. Write one!</div>';
      return;
    }
    container.innerHTML = posts.slice().reverse().map(function (post) {
      return (
        '<div class="admin-post-item">' +
          '<div class="admin-post-info">' +
            '<div class="admin-post-title">' + escHtml(post.title) + '</div>' +
            '<div class="admin-post-meta">' + categoryBadge(post.category) + ' &nbsp;' + escHtml(post.date) + '</div>' +
          '</div>' +
          '<div class="admin-post-btns">' +
            '<button class="admin-post-edit"   onclick="adminSystem.editPost(\'' + post.id + '\')">Edit</button>' +
            '<button class="admin-post-delete" onclick="adminSystem.deletePost(\'' + post.id + '\')">Delete</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function exportCode() {
    loadPosts();
    if (!posts.length) { showToast('No dynamic posts to export yet.'); return; }
    var labels = { numerology:'Numerology', philosophy:'Philosophy', numbers:'The Numbers', practice:'Practice', 'the-system':'The System' };
    var cls    = { philosophy:' gold', numbers:' teal', practice:' rose', 'the-system':' teal' };

    var cardsHtml = posts.map(function(post) {
      var glyph = categoryGlyph(post.category);
      var tag   = '<span class=\"blog-tag' + (cls[post.category]||'') + '\">' + (labels[post.category]||post.category) + '</span>';
      var bannerExport = post.image
        ? '  <div class="blog-card-banner" style="height:120px;background-image:url(' + post.image + ');background-size:cover;background-position:center"></div>'
        : '  <div class="blog-card-banner" style="height:120px"><div class="blog-card-glyph" style="font-size:38px">' + glyph + '</div></div>';
      return [
        '<div class="blog-card" onclick="openPost(\'' + post.id + '\')" data-category="' + post.category + '">',
        bannerExport,
        '  <div class="blog-card-body">',
        '    <div class="blog-card-meta">' + tag + '<span class="blog-date">' + escHtml(post.date) + '</span></div>',
        '    <div class="blog-card-title">' + escHtml(post.title) + '</div>',
        (post.excerpt ? '    <p class="blog-card-excerpt">' + escHtml(post.excerpt) + '</p>' : ''),
        '    <div class="blog-read-more">Read Article &#8594;</div>',
        '  </div>',
        '</div>'
      ].filter(Boolean).join('\n');
    }).join('\n\n');

    var postsHtml = posts.map(function(post) {
      var readTime = Math.max(1, Math.round(post.body.split(/\s+/).length / 200));
      var tag = '<span class=\"blog-tag' + (cls[post.category]||'') + '\">' + (labels[post.category]||post.category) + '</span>';
      return [
        '<div class="blog-post" id="' + post.id + '">',
        '  <button class="blog-post-back" onclick="closePosts()">&#8592; Back to Blog</button>',
        '  <div class="blog-post-eyebrow">' + tag + '</div>',
        '  <h1 class="blog-post-title">' + escHtml(post.title) + '</h1>',
        '  <div class="blog-post-meta">' + escHtml(post.date) + ' &middot; ' + readTime + ' min read</div>',
        '  <div class="blog-post-content">',
        '    ' + markdownToHtml(post.body).replace(/\n/g, '\n    '),
        '  </div>',
        '</div>'
      ].join('\n');
    }).join('\n\n');

    var out = '<!-- PASTE CARDS into #blog-grid -->\n' + cardsHtml +
              '\n\n<!-- PASTE POSTS before closing </div> of page-blog -->\n' + postsHtml;
    var ta = document.getElementById('admin-export-output');
    ta.value = out;
    switchTab('export');
    showToast('Code ready — copy and paste into blog.html');
  }

  function showToast(msg) {
    var t = document.getElementById('admin-toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 2800);
  }

  function escHtml(s) {
    return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function previewCardImage(url) {
    var preview = document.getElementById('admin-image-preview');
    if (!preview) return;
    if (url && url.startsWith('http')) {
      preview.style.display = 'block';
      preview.style.backgroundImage = 'url(' + url + ')';
    } else {
      preview.style.display = 'none';
      preview.style.backgroundImage = '';
    }
  }

  function insertImage() {
    var url = prompt('Paste the image URL:');
    if (!url) return;
    var alt = prompt('Image description (optional):') || '';
    var ta  = document.getElementById('admin-body');
    var pos = ta.selectionStart;
    var tag = '\n![' + alt + '](' + url + ')\n';
    ta.value = ta.value.substring(0, pos) + tag + ta.value.substring(pos);
    ta.selectionStart = ta.selectionEnd = pos + tag.length;
    ta.focus();
  }

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
    var trigger = document.getElementById('admin-trigger');
    if (trigger) {
      trigger.addEventListener('click', function () {
        triggerClicks++;
        clearTimeout(triggerTimer);
        if (triggerClicks >= 5) { triggerClicks = 0; open(); }
        else { triggerTimer = setTimeout(function () { triggerClicks = 0; }, 1200); }
      });
    }

    var overlay = document.getElementById('admin-overlay');
    if (overlay) {
      overlay.addEventListener('click', function (e) { if (e.target === this) close(); });
    }
  }

  return {
    open:         open,
    close:        close,
    login:        login,
    switchTab:    switchTab,
    wrap:         wrap,
    insertBreak:  insertBreak,
    publish:      publish,
    editPost:     editPost,
    deletePost:   deletePost,
    clearForm:    clearForm,
    buildPreview: buildPreview,
    exportCode:   exportCode,
    boot:           boot,
    previewCardImage: previewCardImage,
    insertImage:      insertImage,
  };

})(); // end adminSystem IIFE

// Boot is called by index.html onAllLoaded() after all page fragments are injected.
