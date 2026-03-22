# Convert 3-6-9 and 666 articles to full HTML pages with CSS

$articles = @(
    @{
        path = "blog/3-6-9-pattern-tesla-numerology"
        title = "The 3–6–9 Pattern: Why Tesla Was Right"
        description = "Tesla said 3, 6, and 9 were the key to the universe. The Codex shows exactly why — and what these three frequencies reveal about Mind, Body, and Spirit."
        date = "March 2026"
        breadcrumb = "3-6-9 Pattern"
        tag = "The Numbers"
    },
    @{
        path = "blog/666-numerology-meaning"
        title = "666 Is Not What You Think"
        description = "One of the most feared number sequences in Western culture is actually a structural law encoded into the consciousness matrix. Here's what it actually means."
        date = "March 2026"
        breadcrumb = "666 Meaning"
        tag = "The Numbers"
    }
)

foreach ($article in $articles) {
    $filePath = $article.path + "\index.html"
    
    # Read existing file
    $content = Get-Content -Path $filePath -Raw
    
    # Extract just the blog-post div content (excluding opening/closing tags)
    $match = [regex]::Match($content, '<div class="blog-post"[^>]*?>(.*)</div>\s*$', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($match.Success) {
        $innerContent = $match.Groups[1].Value
    } else {
        Write-Host "Could not extract content from $filePath"
        continue
    }
    
    # Build the new HTML
    $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="$($article.description)">
  <title>$($article.title)</title>
  <link rel="icon" type="image/svg+xml" href="/Images/infinity codex_logo_outline.svg">
  <link rel="stylesheet" href="/css/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600;700&family=Cormorant+SC:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    body { padding-top: 64px; }
    .post-wrap { max-width: 740px; margin: 0 auto; padding: 48px 24px 100px; position: relative; z-index: 1; }
    .blog-post { display: block !important; }
    .blog-post-back { background: none; border: none; font-family: "Cinzel", serif; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: #7cb8a8; cursor: pointer; margin-bottom: 12px; padding: 0; transition: color .2s; }
    .blog-post-back:hover { color: #c9a84c; }
    .blog-post-eyebrow { font-family: "Cinzel", serif; font-size: 9px; letter-spacing: .4em; text-transform: uppercase; margin-bottom: 12px; }
    .blog-tag { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 8px; letter-spacing: .15em; }
    .blog-tag.teal { background: rgba(124,184,168,0.15); color: #7cb8a8; }
    .blog-post-title { font-family: "Cormorant SC", serif; font-weight: 300; font-size: clamp(22px, 4vw, 38px); color: #c9a84c; line-height: 1.2; margin-bottom: 16px; margin-top: 0; letter-spacing: .04em; }
    .blog-post-meta { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .25em; text-transform: uppercase; color: #7a7a7a; margin-bottom: 28px; }
    .blog-post-content { display: block; }
    .breadcrumb { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .2em; text-transform: uppercase; color: #7a7a7a; margin-bottom: 32px; display: flex; align-items: center; gap: 10px; }
    .breadcrumb a { color: #995f46; text-decoration: none; }
    .breadcrumb a:hover { color: #c9a84c; }
    .breadcrumb span { color: #7a7a7a; }
    .blog-post-content h2 { font-family: "Cinzel", serif; font-size: 13px; letter-spacing: .2em; text-transform: uppercase; color: #d4a96a; margin: 44px 0 16px; padding-top: 8px; border-top: 1px solid rgba(201,168,76,0.08); }
    .blog-post-content h3 { font-family: "Cinzel", serif; font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: #7cb8a8; margin: 28px 0 12px; }
    .blog-post-content p { font-size: 18px; line-height: 1.9; color: #c4c4c4; margin-bottom: 20px; }
    .blog-post-content br { display: none; }
    .blog-post-content p strong { color: #ffffff; }
    .blog-post-content ul { margin: 16px 0 20px 0; padding: 0; list-style: none; }
    .blog-post-content ul li { font-size: 17px; line-height: 1.75; color: #c4c4c4; padding: 10px 0 10px 22px; border-bottom: 1px solid rgba(255,255,255,0.04); position: relative; }
    .blog-post-content ul li::before { content: "◈"; position: absolute; left: 0; top: 11px; font-size: 9px; color: #995f46; }
    .blog-post-content blockquote { border-left: 2px solid #995f46; padding: 8px 0 8px 22px; margin: 28px 0; font-size: 19px; font-style: italic; color: #ffffff; line-height: 1.75; }
    .blog-post-figure { margin: 44px auto; max-width: 100%; text-align: center; }
    .blog-post-figure img { max-width: 100%; height: auto; display: block; margin: 0 auto 16px; }
    .blog-post-figure figcaption { font-size: 14px; color: #7a7a7a; font-style: italic; line-height: 1.6; }
    .post-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 56px; padding-top: 40px; border-top: 1px solid rgba(201,168,76,0.1); }
    .post-nav-btn { display: flex; flex-direction: column; gap: 6px; padding: 18px 20px; border: 1px solid rgba(201,168,76,0.1); border-radius: 8px; text-decoration: none; transition: all .3s; background: transparent; }
    .post-nav-btn:hover { border-color: rgba(201,168,76,0.25); background: rgba(201,168,76,0.04); }
    .post-nav-hint { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .25em; text-transform: uppercase; color: #995f46; }
    .post-nav-title { font-size: 15px; color: #ffffff; }
    .related-posts { margin-top: 56px; padding-top: 40px; border-top: 1px solid rgba(201,168,76,0.1); }
    .related-posts-title { font-family: "Cinzel", serif; font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: #c9a84c; margin-bottom: 28px; }
    .related-posts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .related-post-card { display: block; padding: 20px; border: 1px solid rgba(201,168,76,0.15); border-radius: 8px; text-decoration: none; transition: all .3s; background: transparent; }
    .related-post-card:hover { border-color: rgba(201,168,76,0.35); background: rgba(201,168,76,0.05); transform: translateY(-4px); }
    .related-post-title { font-size: 15px; color: #ffffff; margin-bottom: 12px; line-height: 1.4; }
    .related-post-link { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .25em; text-transform: uppercase; color: #7cb8a8; display: inline-block; }
    .related-post-card:hover .related-post-link { color: #c9a84c; }
    @media (max-width: 640px) { .post-nav { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
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

  <div class="post-wrap">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span>&#8250;</span>
      <a href="/#blog">Blog</a>
      <span>&#8250;</span>
      <span>$($article.breadcrumb)</span>
    </nav>

    <div class="blog-post">
      <button class="blog-post-back" onclick="history.back()">← Back to Blog</button>
      <div class="blog-post-eyebrow"><span class="blog-tag teal">$($article.tag)</span></div>
      <h1 class="blog-post-title">$($article.title)</h1>
      <div class="blog-post-meta">$($article.date) · $(if ($article.path -match '3-6-9') { '9 min read' } else { '8 min read' })</div>
      <div class="blog-post-content">
$innerContent
      </div>
    </div>
  </div>

  <footer class="footer" id="footer"></footer>
  <script src="/js/app.js"></script>
</body>
</html>
"@
    
    # Write the new HTML
    Set-Content -Path $filePath -Value $html -Encoding UTF8
    Write-Host "Converted $filePath"
}

Write-Host "Conversion complete!"
