#!/usr/bin/env powershell
# Fix CSS selector depth issue for system articles

$articlesToFix = @(
  "decoding-the-matrix-simulation-source-code",
  "electric-magnetic-aether-three-natures-of-number",
  "infinity-loop-cycles-recursion-numerology",
  "simulation-theory-numerology-source-code",
  "theme-number-birth-year-numerology"
)

# Build corrected CSS - update selectors to target nested content
$correctedCSS = @"
    body { padding-top: 64px; }
    .post-wrap { max-width: 740px; margin: 0 auto; padding: 48px 24px 100px; position: relative; z-index: 1; }
    .post-hero { text-align: center; padding: 56px 24px 40px; border-bottom: 1px solid rgba(201,168,76,0.1); margin-bottom: 48px; }
    .post-hero h1 { font-family: "Cormorant SC", serif; font-weight: 300; font-size: clamp(22px, 4vw, 38px); color: var(--gold); line-height: 1.2; margin-bottom: 16px; letter-spacing: .04em; }
    .post-body { position: relative; }
    .blog-post { position: relative; }
    .blog-post-title { font-family: "Cormorant SC", serif; font-size: 24px; color: #c9a84c; margin: 16px 0 12px; }
    .blog-post-content h2 { font-family: "Cinzel", serif; font-size: 13px; letter-spacing: .2em; text-transform: uppercase; color: #d4a96a; margin: 44px 0 16px; padding-top: 8px; border-top: 1px solid rgba(201,168,76,0.08); }
    .blog-post-content h3 { font-family: "Cinzel", serif; font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: #7cb8a8; margin: 28px 0 12px; }
    .blog-post-content p { font-size: 18px; line-height: 1.9; color: #c4c4c4; margin-bottom: 20px; }
    .blog-post-content p strong { color: #ffffff; }
    .blog-post-content ul { margin: 16px 0 20px 0; padding: 0; list-style: none; }
    .blog-post-content ul li { font-size: 17px; line-height: 1.75; color: #c4c4c4; padding: 10px 0 10px 22px; border-bottom: 1px solid rgba(255,255,255,0.04); position: relative; }
    .blog-post-content ul li::before { content: "◈"; position: absolute; left: 0; top: 11px; font-size: 9px; color: #995f46; }
    .blog-post-content blockquote { border-left: 2px solid #995f46; padding: 8px 0 8px 22px; margin: 28px 0; font-size: 19px; font-style: italic; color: #ffffff; line-height: 1.75; }
    .post-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 56px; padding-top: 40px; border-top: 1px solid rgba(201,168,76,0.1); }
    .post-nav-btn { display: flex; flex-direction: column; gap: 6px; padding: 18px 20px; border: 1px solid rgba(201,168,76,0.1); border-radius: 8px; text-decoration: none; transition: all .3s; background: transparent; }
    .post-nav-btn:hover { border-color: rgba(201,168,76,0.25); background: rgba(201,168,76,0.04); }
    .post-nav-btn.next { text-align: right; }
    .post-nav-hint { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .25em; text-transform: uppercase; color: #995f46; }
    .post-nav-title { font-size: 15px; color: #ffffff; }
    .breadcrumb { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .2em; text-transform: uppercase; color: #7a7a7a; margin-bottom: 32px; display: flex; align-items: center; gap: 10px; }
    .breadcrumb a { color: #995f46; text-decoration: none; transition: color .2s; }
    .breadcrumb a:hover { color: #c9a84c; }
    .breadcrumb span { color: #7a7a7a; }
    .related-posts { margin-top: 56px; padding-top: 40px; border-top: 1px solid rgba(201,168,76,0.1); }
    .related-posts-title { font-family: "Cinzel", serif; font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: #c9a84c; margin-bottom: 28px; }
    .related-posts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .related-post-card { display: block; padding: 20px; border: 1px solid rgba(201,168,76,0.15); border-radius: 8px; text-decoration: none; transition: all .3s; background: transparent; }
    .related-post-card:hover { border-color: rgba(201,168,76,0.35); background: rgba(201,168,76,0.05); transform: translateY(-4px); }
    .related-post-title { font-size: 15px; color: #ffffff; margin-bottom: 12px; line-height: 1.4; }
    .related-post-link { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .25em; text-transform: uppercase; color: #7cb8a8; display: inline-block; transition: color .2s; }
    .related-post-card:hover .related-post-link { color: #c9a84c; }
    @media (max-width: 640px) { .post-nav { grid-template-columns: 1fr; } }
"@

Write-Host "Updating CSS selectors for system articles..."
Write-Host ""

$fixed = 0
foreach ($slug in $articlesToFix) {
  $path = "blog/$slug/index.html"
  if (-not (Test-Path $path)) {
    Write-Host "Skip: $slug (file not found)"
    continue
  }
  
  $content = Get-Content $path -Raw
  
  # Find and replace the style tag content
  if ($content -match '(?s)<style>(.*?)</style>') {
    $content = $content -replace '(?s)<style>(.*?)</style>', "<style>`n$correctedCSS`n  </style>"
    Set-Content -Path $path -Value $content
    Write-Host "[OK] Updated: $slug"
    $fixed++
  }
}

Write-Host ""
Write-Host "======================================"
Write-Host "Complete! Updated $fixed files."
