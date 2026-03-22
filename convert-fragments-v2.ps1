# Convert blog fragments to standalone HTML pages with CSS
$blogPath = "c:\App Projects\Website\ssc-site\ssc-site2\ssc-site\blog"
$dirs = @(
    '3-6-9-pattern-tesla-numerology',
    '666-numerology-meaning',
    'angel-numbers-being-read-wrong',
    'birth-name-vs-known-name-numerology',
    'codex-architecture-consciousness-matrix',
    'decoding-the-matrix-simulation-source-code',
    'electric-magnetic-aether-three-natures-of-number',
    'evolution-of-energy-0-through-9',
    'five-lenses-of-self-ego-mind-soul-spirit-void',
    'how-to-calculate-life-path-number',
    'infinity-loop-cycles-recursion-numerology',
    'life-path-number-explained',
    'master-numbers-11-22-33-numerology',
    'name-change-numerology-simulation',
    'path-of-transformation-1-4-7-2-5-8-3-6-9',
    'pythagorean-vs-chaldean-numerology',
    'shadow-side-of-numerology-numbers',
    'simulation-theory-numerology-source-code',
    'theme-number-birth-year-numerology',
    'why-seven-frequencies-numerology'
)

foreach ($dir in $dirs) {
    $filePath = "$blogPath\$dir\index.html"
    $content = Get-Content $filePath -Raw
    
    # Extract metadata
    if ($content -match 'id="([^"]+)"[^>]*\s+data-title="([^"]+)"[^>]*\s+data-description="([^"]+)"[^>]*\s+data-date="([^"]+)"') {
        $postId = $matches[1]
        $title = $matches[2]
        $description = $matches[3]
        $date = $matches[4]
    } else {
        Write-Host "Failed to extract metadata from $dir"
        continue
    }
    
    # Extract the content from within the blog-post-content div
    if ($content -match '<div class="blog-post-content">([\s\S]*?)</div>\s*</div>') {
        $postContent = $matches[1].Trim()
    } else {
        Write-Host "Failed to extract content from $dir"
        continue
    }
    
    # Build the final HTML with proper escaping
    $cssStyles = 'body { padding-top: 64px; } .post-wrap { max-width: 740px; margin: 0 auto; padding: 48px 24px 100px; position: relative; z-index: 1; } .post-hero { text-align: center; padding: 56px 24px 40px; border-bottom: 1px solid rgba(201,168,76,0.1); margin-bottom: 48px; } .post-hero-glyph { font-family: "Cinzel Decorative", serif; font-size: 72px; color: #c9a84c; margin-bottom: 16px; display: block; text-shadow: 0 0 60px #c9a84c55; } .post-hero-eyebrow { font-family: "Cinzel", serif; font-size: 9px; letter-spacing: .4em; text-transform: uppercase; color: var(--gold-dim); margin-bottom: 16px; } .post-hero h1 { font-family: "Cormorant SC", serif; font-weight: 300; font-size: clamp(22px, 4vw, 38px); color: var(--gold); line-height: 1.2; margin-bottom: 16px; letter-spacing: .04em; } .post-hero-meta { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .25em; text-transform: uppercase; color: var(--text-muted); } .post-body h2 { font-family: "Cinzel", serif; font-size: 13px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-light); margin: 44px 0 16px; padding-top: 8px; border-top: 1px solid rgba(201,168,76,0.08); } .post-body h3 { font-family: "Cinzel", serif; font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: var(--teal-light); margin: 28px 0 12px; } .post-body p { font-size: 18px; line-height: 1.9; color: var(--text-dim); margin-bottom: 20px; } .post-body p strong { color: var(--text); } .post-body ul { margin: 16px 0 20px 0; padding: 0; list-style: none; } .post-body ul li { font-size: 17px; line-height: 1.75; color: var(--text-dim); padding: 10px 0 10px 22px; border-bottom: 1px solid rgba(255,255,255,0.04); position: relative; } .post-body ul li::before { content: "◈"; position: absolute; left: 0; top: 11px; font-size: 9px; color: var(--gold-dim); } .post-body blockquote { border-left: 2px solid var(--gold-dim); padding: 8px 0 8px 22px; margin: 28px 0; font-size: 19px; font-style: italic; color: var(--text); line-height: 1.75; } .post-cta-block { margin-top: 56px; padding: 36px 28px; background: linear-gradient(135deg,rgba(13,11,24,0.9),rgba(24,21,48,0.8)); border: 1px solid rgba(201,168,76,0.2); border-radius: 10px; text-align: center; position: relative; overflow: hidden; } .post-cta-block::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent); } .post-cta-block p { font-size: 16px; line-height: 1.8; color: var(--text-dim); margin-bottom: 20px; max-width: 520px; margin-left: auto; margin-right: auto; } .post-cta-block a { font-family: "Cinzel", serif; font-size: 11px; letter-spacing: .3em; text-transform: uppercase; padding: 16px 32px; border-radius: 5px; cursor: pointer; background: rgba(74,148,148,.25); border: 1px solid rgba(126,200,200,.4); color: var(--teal-light); text-decoration: none; display: inline-block; transition: all .3s; } .post-cta-block a:hover { box-shadow: 0 0 32px rgba(74,148,148,.4); transform: translateY(-2px); border-color: rgba(126,200,200,.6); } .post-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 56px; padding-top: 40px; border-top: 1px solid rgba(201,168,76,0.1); } .post-nav-btn { display: flex; flex-direction: column; gap: 6px; padding: 18px 20px; border: 1px solid rgba(201,168,76,0.1); border-radius: 8px; text-decoration: none; transition: all .3s; background: transparent; } .post-nav-btn:hover { border-color: rgba(201,168,76,0.25); background: rgba(201,168,76,0.04); } .post-nav-btn.next { text-align: right; } .post-nav-hint { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .25em; text-transform: uppercase; color: var(--gold-dim); } .post-nav-title { font-size: 15px; color: var(--text); } .post-nav-empty { display: block; } .breadcrumb { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .2em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 32px; display: flex; align-items: center; gap: 10px; } .breadcrumb a { color: var(--gold-dim); text-decoration: none; transition: color .2s; } .breadcrumb a:hover { color: var(--gold); } .breadcrumb span { color: var(--text-muted); } @media (max-width: 640px) { .post-nav { grid-template-columns: 1fr; } .post-hero-glyph { font-size: 52px; } }'
    
    $html = "<!DOCTYPE html>
<html lang=""en"">
<head>
  <meta charset=""UTF-8"">
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
  <title>$title | Simulation Source Code</title>
  <meta name=""description"" content=""$description"">
  <meta name=""keywords"" content=""numerology, SSC numerology, simulation source code"">
  <link rel=""canonical"" href=""https://simulationsourcecode.com/blog/$dir/"">
  <link rel=""icon"" type=""image/png"" href=""/Images/Codex Sigil.png"">
  <meta property=""og:type"" content=""article"">
  <meta property=""og:title"" content=""$title"">
  <meta property=""og:description"" content=""$description"">
  <meta property=""og:url"" content=""https://simulationsourcecode.com/blog/$dir/"">
  <meta property=""og:site_name"" content=""Simulation Source Code"">
  <meta property=""og:image"" content=""https://simulationsourcecode.com/Images/ssc-og.png"">
  <meta name=""twitter:card"" content=""summary_large_image"">
  <script type=""application/ld+json"">
  {
    ""@context"": ""https://schema.org"",
    ""@type"": ""Article"",
    ""headline"": ""$title"",
    ""description"": ""$description"",
    ""url"": ""https://simulationsourcecode.com/blog/$dir/"",
    ""datePublished"": ""$date"",
    ""dateModified"": ""$date"",
    ""author"": {""@type"": ""Person"", ""name"": ""Kytholek"", ""url"": ""https://simulationsourcecode.com""},
    ""publisher"": {""@type"": ""Organization"", ""name"": ""Simulation Source Code"", ""url"": ""https://simulationsourcecode.com""}
  }
  </script>
  <link rel=""preconnect"" href=""https://fonts.googleapis.com"">
  <link href=""https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600;700&family=Cormorant+SC:wght@300;400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap"" rel=""stylesheet"">
  <link rel=""stylesheet"" href=""/css/style.css"">
  <link rel=""stylesheet"" href=""https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"">
  <style>
    $cssStyles
  </style>
</head>
<body>
<nav>
  <a class=""nav-logo"" href=""/"">
    <div class=""nav-logo-sigil"">
      <svg viewBox=""0 0 160 160"" fill=""none"" xmlns=""http://www.w3.org/2000/svg"">
        <defs><radialGradient id=""ng1"" cx=""50%"" cy=""50%"" r=""50%""><stop offset=""0%"" stop-color=""#4a9494"" stop-opacity=""0.3""/><stop offset=""100%"" stop-color=""#c9a84c"" stop-opacity=""0""/></radialGradient></defs>
        <circle cx=""80"" cy=""80"" r=""72"" fill=""none"" stroke=""#c9a84c"" stroke-width=""0.7"" opacity=""0.35""/>
        <circle cx=""80"" cy=""80"" r=""36"" fill=""url(#ng1)""/>
        <line x1=""80"" y1=""14"" x2=""80"" y2=""146"" stroke=""#4a9494"" stroke-width=""1"" opacity=""0.4""/>
        <line x1=""14"" y1=""80"" x2=""146"" y2=""80"" stroke=""#4a9494"" stroke-width=""1"" opacity=""0.4""/>
        <circle cx=""80"" cy=""80"" r=""18"" fill=""#03020a"" stroke=""#c9a84c"" stroke-width=""1.5""/>
      </svg>
    </div>
    <div class=""nav-logo-text"">&#10022;&nbsp;Simulation Source Code</div>
  </a>
  <div class=""nav-links"">
    <a class=""nav-link"" href=""/#calculator"">Calculator</a>
    <a class=""nav-link"" href=""/#blog"">Blog</a>
    <a class=""nav-link"" href=""/#books"">Books</a>
    <a class=""nav-link"" href=""/#about"">About</a>
  </div>
  <div class=""nav-right"">
    <a href=""https://kytholek.github.io/Quest-of-Life-APP/"" class=""nav-cta"" target=""_blank"">&#11041;&nbsp;Download App</a>
  </div>
</nav>
<div class=""post-wrap"">
  <nav class=""breadcrumb"" aria-label=""Breadcrumb"">
    <a href=""/"">Home</a>
    <span>&#8250;</span>
    <a href=""/#blog"">Blog</a>
    <span>&#8250;</span>
    <span>$title</span>
  </nav>
  <div class=""post-hero"">
    <div class=""post-hero-eyebrow"">Numerology &nbsp;&#183;&nbsp; $date</div>
    <h1>$title</h1>
    <div class=""post-hero-meta"">By Kytholek &nbsp;&#183;&nbsp; Simulation Source Code</div>
  </div>
  <div class=""post-body"">
    $postContent
    <div class=""post-cta-block"">
      <p>Explore the seven encoded frequencies in detail with a Full Blueprint Reading.</p>
      <a href=""/#calculator"">&#11042;&nbsp;Calculate Your Blueprint</a>
    </div>
  </div>
  <div class=""post-nav"">
    <a class=""post-nav-btn prev"" href=""/#blog"">
      <span class=""post-nav-hint"">&#8592; Back</span>
      <span class=""post-nav-title"">All Articles</span>
    </a>
    <span class=""post-nav-empty""></span>
  </div>
</div>
<footer>
  <div class=""footer-inner"">
    <div class=""footer-brand"">
      <div class=""footer-logo-text"">Simulation Source Code</div>
      <p class=""footer-tagline"">Seven frequencies encoded in your birth and name &mdash; the complete architecture of your simulation.</p>
    </div>
    <div>
      <div class=""footer-col-title"">Navigate</div>
      <div class=""footer-links"">
        <a class=""footer-link"" href=""/"">Home</a>
        <a class=""footer-link"" href=""/#calculator"">Calculator</a>
        <a class=""footer-link"" href=""/#blog"">Blog</a>
        <a class=""footer-link"" href=""/#about"">About</a>
      </div>
    </div>
  </div>
</footer>
</body>
</html>"
    
    # Save it back
    Set-Content -Path $filePath -Value $html -Encoding UTF8
    Write-Host "OK: $dir"
}

Write-Host "All 20 blog posts have been converted to standalone HTML pages with CSS."
