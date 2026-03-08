// ─── Init (called after all HTML fragments are loaded) ───
function initApp() {
  showPage('home');
}

// ─── Page routing ───
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (page) {
    page.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const navLink = document.getElementById('nav-' + name);
  if (navLink) navLink.classList.add('active');
}

// ─── Mobile menu ───
function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('open');
}

// ─── Numerology calculations ───
// ─── Blog ───
function openPost(id) {
  document.getElementById('blog-listing').style.display = 'none';
  document.querySelectorAll('.blog-post').forEach(p => p.classList.remove('active'));
  const post = document.getElementById(id);
  if (post) { post.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
}

function closePosts() {
  document.querySelectorAll('.blog-post').forEach(p => p.classList.remove('active'));
  document.getElementById('blog-listing').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
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

// ── Expose functions called from inline HTML onclick attributes ──
window.toggleMenu       = toggleMenu;
window.showPage         = showPage;
window.openPost         = openPost;
window.closePosts       = closePosts;
window.filterBlog       = filterBlog;

// ── Fallback: event delegation for calc button (in case onclick is dropped) ──
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('calc-btn')) {
    calculateReading();
  }
});
