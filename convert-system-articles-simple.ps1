#!/usr/bin/env pwsh
# Convert system article fragments to full HTML pages with embedded styles

$articlesToConvert = @(
  "decoding-the-matrix-simulation-source-code",
  "electric-magnetic-aether-three-natures-of-number",
  "infinity-loop-cycles-recursion-numerology",
  "simulation-theory-numerology-source-code",
  "theme-number-birth-year-numerology"
)

Write-Host "Converting system articles to full HTML pages..."
Write-Host ""

$converted = 0
foreach ($slug in $articlesToConvert) {
  $path = "blog/$slug/index.html"
  if (-not (Test-Path $path)) {
    Write-Host "Skip: $slug (file not found)"
    continue
  }
  
  $content = Get-Content $path -Raw
  
  # Check if already converted
  if ($content -match '<!DOCTYPE html>') {
    Write-Host "Already converted: $slug"
    continue
  }
  
  # Extract title and description from data attributes
  $title = "System Article"
  $description = "Learn about $slug in Simulation Source Code."
  $breadcrumb = $slug -replace '-', ' '
  
  if ($content -match 'data-title="([^"]*)"') {
    $title = $matches[1]
  }
  
  if ($content -match 'data-description="([^"]*)"') {
    $description = $matches[1]
  }
  
  # Extract blog-post ID for breadcrumb
  if ($content -match 'id="([^"]*)"') {
    $postId = $matches[1]
    $breadcrumb = $postId -replace 'post-', '' -replace '-', ' ' | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1) }
  }
  
  # Remove fragment comments from start
  $content = $content -replace '<!-- blog/[^>]*\.html[^\n]*\n', ''
  $content = $content -replace '<!-- [^>]*-->\n', ''
  
  # Build new HTML with full page structure
  $newContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$title | Simulation Source Code</title>
  <meta name="description" content="$description">
  <link rel="canonical" href="https://simulationsourcecode.com/blog/$slug/">
  <link rel="stylesheet" href="/css/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600;700&family=Cormorant+SC:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    body { padding-top: 64px; }
    .post-wrap { max-width: 740px; margin: 0 auto; padding: 48px 24px 100px; position: relative; z-index: 1; }
    .post-hero { text-align: center; padding: 56px 24px 40px; border-bottom: 1px solid rgba(201,168,76,0.1); margin-bottom: 48px; }
    .post-hero-eyebrow { font-family: "Cinzel", serif; font-size: 9px; letter-spacing: .4em; text-transform: uppercase; color: var(--gold-dim); margin-bottom: 16px; }
    .post-hero h1 { font-family: "Cormorant SC", serif; font-weight: 300; font-size: clamp(22px, 4vw, 38px); color: var(--gold); line-height: 1.2; margin-bottom: 16px; letter-spacing: .04em; }
    .post-hero-meta { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .25em; text-transform: uppercase; color: var(--text-muted); }
    .post-body h2 { font-family: "Cinzel", serif; font-size: 13px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-light); margin: 44px 0 16px; padding-top: 8px; border-top: 1px solid rgba(201,168,76,0.08); }
    .post-body h3 { font-family: "Cinzel", serif; font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: var(--teal-light); margin: 28px 0 12px; }
    .post-body p { font-size: 18px; line-height: 1.9; color: var(--text-dim); margin-bottom: 20px; }
    .post-body p strong { color: var(--text); }
    .post-body ul { margin: 16px 0 20px 0; padding: 0; list-style: none; }
    .post-body ul li { font-size: 17px; line-height: 1.75; color: var(--text-dim); padding: 10px 0 10px 22px; border-bottom: 1px solid rgba(255,255,255,0.04); position: relative; }
    .post-body ul li::before { content: "◈"; position: absolute; left: 0; top: 11px; font-size: 9px; color: var(--gold-dim); }
    .post-body blockquote { border-left: 2px solid var(--gold-dim); padding: 8px 0 8px 22px; margin: 28px 0; font-size: 19px; font-style: italic; color: var(--text); line-height: 1.75; }
    .post-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 56px; padding-top: 40px; border-top: 1px solid rgba(201,168,76,0.1); }
    .post-nav-btn { display: flex; flex-direction: column; gap: 6px; padding: 18px 20px; border: 1px solid rgba(201,168,76,0.1); border-radius: 8px; text-decoration: none; transition: all .3s; background: transparent; }
    .post-nav-btn:hover { border-color: rgba(201,168,76,0.25); background: rgba(201,168,76,0.04); }
    .post-nav-btn.next { text-align: right; }
    .post-nav-hint { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .25em; text-transform: uppercase; color: var(--gold-dim); }
    .post-nav-title { font-size: 15px; color: var(--text); }
    .breadcrumb { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .2em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 32px; display: flex; align-items: center; gap: 10px; }
    .breadcrumb a { color: var(--gold-dim); text-decoration: none; transition: color .2s; }
    .breadcrumb a:hover { color: var(--gold); }
    .breadcrumb span { color: var(--text-muted); }
    .related-posts { margin-top: 56px; padding-top: 40px; border-top: 1px solid rgba(201,168,76,0.1); }
    .related-posts-title { font-family: "Cinzel", serif; font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: var(--gold); margin-bottom: 28px; }
    .related-posts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .related-post-card { display: block; padding: 20px; border: 1px solid rgba(201,168,76,0.15); border-radius: 8px; text-decoration: none; transition: all .3s; background: transparent; }
    .related-post-card:hover { border-color: rgba(201,168,76,0.35); background: rgba(201,168,76,0.05); transform: translateY(-4px); }
    .related-post-title { font-size: 15px; color: var(--text); margin-bottom: 12px; line-height: 1.4; }
    .related-post-link { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .25em; text-transform: uppercase; color: var(--teal-light); display: inline-block; transition: color .2s; }
    .related-post-card:hover .related-post-link { color: var(--gold); }
    @media (max-width: 640px) { .post-nav { grid-template-columns: 1fr; } }
  </style>
</head>
<body>

<!-- NAV -->
<nav>
  <a class="nav-logo" href="/">
    <div class="nav-logo-sigil">
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><radialGradient id="ng1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#4a9494" stop-opacity="0.3"/><stop offset="100%" stop-color="#c9a84c" stop-opacity="0"/></radialGradient></defs>
        <circle cx="80" cy="80" r="72" fill="none" stroke="#c9a84c" stroke-width="0.7" opacity="0.35"/>
        <circle cx="80" cy="80" r="36" fill="url(#ng1)"/>
        <line x1="80" y1="14" x2="80" y2="146" stroke="#4a9494" stroke-width="1" opacity="0.4"/>
        <line x1="14" y1="80" x2="146" y2="80" stroke="#4a9494" stroke-width="1" opacity="0.4"/>
        <circle cx="80" cy="80" r="18" fill="#03020a" stroke="#c9a84c" stroke-width="1.5"/>
      </svg>
    </div>
    <div class="nav-logo-text">&#10022;&nbsp;Simulation Source Code</div>
  </a>
  <div class="nav-links">
    <a class="nav-link" href="/#calculator">Calculator</a>
    <a class="nav-link" href="/#blog">Blog</a>
    <a class="nav-link" href="/#books">Books</a>
    <a class="nav-link" href="/#about">About</a>
  </div>
  <div class="nav-right">
    <a href="https://kytholek.github.io/Quest-of-Life-APP/" class="nav-cta" target="_blank">&#11041;&nbsp;Download App</a>
  </div>
</nav>

<!-- CONTENT -->
<div class="post-wrap">

  <!-- Breadcrumb -->
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/">Home</a>
    <span>&#8250;</span>
    <a href="/#blog">Blog</a>
    <span>&#8250;</span>
    <span>$breadcrumb</span>
  </nav>

  <!-- Hero -->
  <div class="post-hero">
    <h1>$title</h1>
  </div>

  <!-- Body -->
  <div class="post-body">

$content

  </div>

</div>

<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <div class="footer-logo-text">Simulation Source Code</div>
      <p class="footer-tagline">Seven frequencies encoded in your birth and name &#8212; the complete architecture of your simulation.</p>
    </div>
    <div></div>
  </div>
</footer>

</body></html>
"@
  
  Set-Content -Path $path -Value $newContent
  Write-Host "[OK] Converted: $slug"
  $converted++
}

Write-Host ""
Write-Host "======================================"
Write-Host "Complete! Converted $converted files."
