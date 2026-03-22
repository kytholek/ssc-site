#!/usr/bin/env powershell
# Fix system articles by extracting content from wrappers

$articlesToFix = @(
  "decoding-the-matrix-simulation-source-code",
  "electric-magnetic-aether-three-natures-of-number",
  "infinity-loop-cycles-recursion-numerology",
  "simulation-theory-numerology-source-code",
  "theme-number-birth-year-numerology"
)

Write-Host "Fixing system articles content structure..."
Write-Host ""

$fixed = 0
foreach ($slug in $articlesToFix) {
  $path = "blog/$slug/index.html"
  if (-not (Test-Path $path)) {
    Write-Host "Skip: $slug (file not found)"
    continue
  }
  
  $content = Get-Content $path -Raw
  
  # Extract content from .blog-post-content div
  if ($content -match '(?s)<div class="blog-post-content">(.*?)</div>\s*<div class="related-posts">') {
    $innerContent = $matches[1]
    
    # Replace the entire wrapper section with just the inner content
    $oldSection = $content -match '(?s)<div class="blog-post" id="[^"]*"[^>]*>.*?</div>\s*<div class="related-posts">'
    
    $content = $content -replace '(?s)<!-- Loaded dynamically[^>]*-->.*?<div class="blog-post" id="[^"]*"[^>]*>.*?<div class="blog-post-content">(.*?)</div>\s*</div>', $innerContent
    
    Set-Content -Path $path -Value $content
    Write-Host "[OK] Fixed: $slug"
    $fixed++
  }
}

Write-Host ""
Write-Host "======================================"
Write-Host "Complete! Fixed $fixed files."
