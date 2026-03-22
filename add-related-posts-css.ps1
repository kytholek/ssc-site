#!/usr/bin/env pwsh
# Add related-posts CSS to all blog article files

$blogDir = "blog"

$relatedPostsCSS = @"
    .related-posts { margin-top: 56px; padding-top: 40px; border-top: 1px solid rgba(201,168,76,0.1); }
    .related-posts-title { font-family: "Cinzel", serif; font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: var(--gold); margin-bottom: 28px; }
    .related-posts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .related-post-card { display: block; padding: 20px; border: 1px solid rgba(201,168,76,0.15); border-radius: 8px; text-decoration: none; transition: all .3s; background: transparent; }
    .related-post-card:hover { border-color: rgba(201,168,76,0.35); background: rgba(201,168,76,0.05); transform: translateY(-4px); }
    .related-post-title { font-size: 15px; color: var(--text); margin-bottom: 12px; line-height: 1.4; }
    .related-post-link { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .25em; text-transform: uppercase; color: var(--teal-light); display: inline-block; transition: color .2s; }
    .related-post-card:hover .related-post-link { color: var(--gold); }
"@

$addedCount = 0
$failedCount = 0
$skippedCount = 0
$failedDirs = @()

Get-ChildItem -Path $blogDir -Directory | ForEach-Object {
  $dirName = $_.Name
  $indexPath = Join-Path $_.FullName "index.html"
  
  if (-not (Test-Path $indexPath)) {
    return
  }
  
  $content = Get-Content $indexPath -Raw
  
  # Skip if no <style> tag (fragment without CSS)
  if ($content -notmatch '<style>') {
    $skippedCount++
    return
  }
  
  # Skip if related-posts CSS already present
  if ($content -match '\.related-posts\s*\{') {
    Write-Host "Already has CSS: $dirName"
    return
  }
  
  # Find closing </style> and insert CSS before it
  $pattern = '(\s*)</style>'
  if ($content -match $pattern) {
    $newContent = $content -replace $pattern, "`r`n$relatedPostsCSS`r`n`$1</style>"
    Set-Content -Path $indexPath -Value $newContent
    Write-Host "Added CSS: $dirName"
    $addedCount++
  } else {
    Write-Host "Failed: $dirName - could not find </style> tag"
    $failedCount++
    $failedDirs += $dirName
  }
}

Write-Host ""
Write-Host "======================================"
Write-Host "Completed!"
Write-Host "Added CSS to: $addedCount files"
Write-Host "Skipped (fragments): $skippedCount files"
if ($failedCount -gt 0) {
  Write-Host "Failed: $failedCount files"
  $failedDirs | ForEach-Object { Write-Host "  - $_" }
}
