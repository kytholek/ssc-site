#!/usr/bin/env pwsh
# Complete script to add related posts to ALL 29 blog articles
# Uses actual directory names from file system

$blogDir = "blog"
$relatedPostsHTML = @{
  "life-path-1-numerology" = @(
    @{ url = "/blog/life-path-2-numerology/"; title = "Life Path 2: The Bridge" }
    @{ url = "/blog/life-path-9-numerology/"; title = "Life Path 9: The Sage" }
    @{ url = "/blog/path-of-transformation-1-4-7-2-5-8-3-6-9/"; title = "Path of Transformation" }
  )
  "life-path-2-numerology" = @(
    @{ url = "/blog/life-path-1-numerology/"; title = "Life Path 1: The Initiator" }
    @{ url = "/blog/life-path-3-numerology/"; title = "Life Path 3: The Creator" }
    @{ url = "/blog/birth-name-vs-known-name-numerology/"; title = "Birth Name vs. Known Name" }
  )
  "life-path-3-numerology" = @(
    @{ url = "/blog/life-path-2-numerology/"; title = "Life Path 2: The Bridge" }
    @{ url = "/blog/life-path-6-numerology/"; title = "Life Path 6: The Healer" }
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers (11, 22, 33)" }
  )
  "life-path-4-numerology" = @(
    @{ url = "/blog/life-path-1-numerology/"; title = "Life Path 1: The Initiator" }
    @{ url = "/blog/life-path-7-numerology/"; title = "Life Path 7: The Seeker" }
    @{ url = "/blog/codex-architecture-consciousness-matrix/"; title = "Codex Architecture" }
  )
  "life-path-5-numerology" = @(
    @{ url = "/blog/life-path-3-numerology/"; title = "Life Path 3: The Creator" }
    @{ url = "/blog/life-path-7-numerology/"; title = "Life Path 7: The Seeker" }
    @{ url = "/blog/evolution-of-energy-0-through-9/"; title = "Evolution of Energy" }
  )
  "life-path-6-numerology" = @(
    @{ url = "/blog/life-path-3-numerology/"; title = "Life Path 3: The Creator" }
    @{ url = "/blog/life-path-9-numerology/"; title = "Life Path 9: The Sage" }
    @{ url = "/blog/shadow-side-of-numerology-numbers/"; title = "Shadow Side of Numerology" }
  )
  "life-path-7-numerology" = @(
    @{ url = "/blog/life-path-4-numerology/"; title = "Life Path 4: The Foundation" }
    @{ url = "/blog/life-path-5-numerology/"; title = "Life Path 5: The Explorer" }
    @{ url = "/blog/why-seven-frequencies-numerology/"; title = "Why Seven?" }
  )
  "life-path-8-numerology" = @(
    @{ url = "/blog/life-path-5-numerology/"; title = "Life Path 5: The Explorer" }
    @{ url = "/blog/life-path-1-numerology/"; title = "Life Path 1: The Initiator" }
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers (11, 22, 33)" }
  )
  "life-path-9-numerology" = @(
    @{ url = "/blog/life-path-6-numerology/"; title = "Life Path 6: The Healer" }
    @{ url = "/blog/life-path-3-numerology/"; title = "Life Path 3: The Creator" }
    @{ url = "/blog/3-6-9-pattern-tesla-numerology/"; title = "3-6-9 Pattern" }
  )
  "3-6-9-pattern-tesla-numerology" = @(
    @{ url = "/blog/life-path-9-numerology/"; title = "Life Path 9: The Sage" }
    @{ url = "/blog/666-numerology-meaning/"; title = "666 Meaning" }
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers" }
  )
  "666-numerology-meaning" = @(
    @{ url = "/blog/3-6-9-pattern-tesla-numerology/"; title = "3-6-9 Pattern" }
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers" }
    @{ url = "/blog/life-path-6-numerology/"; title = "Life Path 6: The Healer" }
  )
  "angel-numbers-being-read-wrong" = @(
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers" }
    @{ url = "/blog/666-numerology-meaning/"; title = "666 Meaning" }
    @{ url = "/blog/3-6-9-pattern-tesla-numerology/"; title = "3-6-9 Pattern" }
  )
  "birth-name-vs-known-name-numerology" = @(
    @{ url = "/blog/life-path-2-numerology/"; title = "Life Path 2: The Bridge" }
    @{ url = "/blog/name-change-numerology-simulation/"; title = "Name Change Numerology" }
    @{ url = "/blog/how-to-calculate-life-path-number/"; title = "Calculate Life Path" }
  )
  "codex-architecture-consciousness-matrix" = @(
    @{ url = "/blog/decoding-the-matrix-simulation-source-code/"; title = "Decoding the Matrix" }
    @{ url = "/blog/simulation-theory-numerology-source-code/"; title = "Simulation Theory" }
    @{ url = "/blog/five-lenses-of-self-ego-mind-soul-spirit-void/"; title = "Five Lenses" }
  )
  "decoding-the-matrix-simulation-source-code" = @(
    @{ url = "/blog/codex-architecture-consciousness-matrix/"; title = "Codex Architecture" }
    @{ url = "/blog/simulation-theory-numerology-source-code/"; title = "Simulation Theory" }
    @{ url = "/blog/electric-magnetic-aether-three-natures-of-number/"; title = "Electric & Magnetic" }
  )
  "electric-magnetic-aether-three-natures-of-number" = @(
    @{ url = "/blog/decoding-the-matrix-simulation-source-code/"; title = "Decoding the Matrix" }
    @{ url = "/blog/five-lenses-of-self-ego-mind-soul-spirit-void/"; title = "Five Lenses" }
    @{ url = "/blog/simulation-theory-numerology-source-code/"; title = "Simulation Theory" }
  )
  "evolution-of-energy-0-through-9" = @(
    @{ url = "/blog/five-lenses-of-self-ego-mind-soul-spirit-void/"; title = "Five Lenses" }
    @{ url = "/blog/life-path-5-numerology/"; title = "Life Path 5: The Explorer" }
    @{ url = "/blog/simulation-theory-numerology-source-code/"; title = "Simulation Theory" }
  )
  "five-lenses-of-self-ego-mind-soul-spirit-void" = @(
    @{ url = "/blog/codex-architecture-consciousness-matrix/"; title = "Codex Architecture" }
    @{ url = "/blog/electric-magnetic-aether-three-natures-of-number/"; title = "Electric & Magnetic" }
    @{ url = "/blog/evolution-of-energy-0-through-9/"; title = "Evolution of Energy" }
  )
  "how-to-calculate-life-path-number" = @(
    @{ url = "/blog/pythagorean-vs-chaldean-numerology/"; title = "Pythagorean vs Chaldean" }
    @{ url = "/blog/birth-name-vs-known-name-numerology/"; title = "Birth Name vs Known" }
    @{ url = "/blog/name-change-numerology-simulation/"; title = "Name Change Numerology" }
  )
  "infinity-loop-cycles-recursion-numerology" = @(
    @{ url = "/blog/simulation-theory-numerology-source-code/"; title = "Simulation Theory" }
    @{ url = "/blog/life-path-8-numerology/"; title = "Life Path 8: The Organizer" }
    @{ url = "/blog/codex-architecture-consciousness-matrix/"; title = "Codex Architecture" }
  )
  "life-path-number-explained" = @(
    @{ url = "/blog/how-to-calculate-life-path-number/"; title = "Calculate Life Path" }
    @{ url = "/blog/birth-name-vs-known-name-numerology/"; title = "Birth Name vs Known" }
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers" }
  )
  "master-numbers-11-22-33-numerology" = @(
    @{ url = "/blog/3-6-9-pattern-tesla-numerology/"; title = "3-6-9 Pattern" }
    @{ url = "/blog/angel-numbers-being-read-wrong/"; title = "Angel Numbers" }
    @{ url = "/blog/life-path-2-numerology/"; title = "Life Path 2: The Bridge" }
  )
  "name-change-numerology-simulation" = @(
    @{ url = "/blog/birth-name-vs-known-name-numerology/"; title = "Birth Name vs Known" }
    @{ url = "/blog/life-path-2-numerology/"; title = "Life Path 2: The Bridge" }
    @{ url = "/blog/how-to-calculate-life-path-number/"; title = "Calculate Life Path" }
  )
  "path-of-transformation-1-4-7-2-5-8-3-6-9" = @(
    @{ url = "/blog/life-path-1-numerology/"; title = "Life Path 1: The Initiator" }
    @{ url = "/blog/life-path-4-numerology/"; title = "Life Path 4: The Foundation" }
    @{ url = "/blog/life-path-7-numerology/"; title = "Life Path 7: The Seeker" }
  )
  "pythagorean-vs-chaldean-numerology" = @(
    @{ url = "/blog/how-to-calculate-life-path-number/"; title = "Calculate Life Path" }
    @{ url = "/blog/life-path-number-explained/"; title = "Life Path Number" }
    @{ url = "/blog/birth-name-vs-known-name-numerology/"; title = "Birth Name vs Known" }
  )
  "shadow-side-of-numerology-numbers" = @(
    @{ url = "/blog/life-path-6-numerology/"; title = "Life Path 6: The Healer" }
    @{ url = "/blog/life-path-8-numerology/"; title = "Life Path 8: The Organizer" }
    @{ url = "/blog/evolution-of-energy-0-through-9/"; title = "Evolution of Energy" }
  )
  "simulation-theory-numerology-source-code" = @(
    @{ url = "/blog/codex-architecture-consciousness-matrix/"; title = "Codex Architecture" }
    @{ url = "/blog/decoding-the-matrix-simulation-source-code/"; title = "Decoding the Matrix" }
    @{ url = "/blog/infinity-loop-cycles-recursion-numerology/"; title = "Infinity Loop" }
  )
  "theme-number-birth-year-numerology" = @(
    @{ url = "/blog/life-path-number-explained/"; title = "Life Path Number" }
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers" }
    @{ url = "/blog/pythagorean-vs-chaldean-numerology/"; title = "Pythagorean vs Chaldean" }
  )
  "why-seven-frequencies-numerology" = @(
    @{ url = "/blog/life-path-7-numerology/"; title = "Life Path 7: The Seeker" }
    @{ url = "/blog/3-6-9-pattern-tesla-numerology/"; title = "3-6-9 Pattern" }
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers" }
  )
}

function Get-RelatedPostsHTML {
  param([array]$posts)
  
  $html = @"
  <div class="related-posts">
    <div class="related-posts-title">Related Articles</div>
    <div class="related-posts-grid">
"@
  
  foreach ($post in $posts) {
    $html += @"

      <a href="$($post.url)" class="related-post-card">
        <div class="related-post-title">$($post.title)</div>
        <span class="related-post-link">Read More</span>
      </a>
"@
  }
  
  $html += @"

    </div>
  </div>
"@
  
  return $html
}

# Get all blog directories
$addedCount = 0
$failedCount = 0
$failedDirs = @()
$skippedDirs = @()

Get-ChildItem -Path $blogDir -Directory | ForEach-Object {
  $dirName = $_.Name
  
  # Skip if no mapping exists
  if (-not $relatedPostsHTML.ContainsKey($dirName)) {
    $skippedDirs += $dirName
    return
  }
  
  $indexPath = Join-Path $_.FullName "index.html"
  
  if (-not (Test-Path $indexPath)) {
    return
  }
  
  $content = Get-Content $indexPath -Raw
  
  # Skip if already has related-posts
  if ($content -match 'class="related-posts"') {
    Write-Host "Already exists: $dirName"
    return
  }
  
  $posts = $relatedPostsHTML[$dirName]
  $relatedHTML = Get-RelatedPostsHTML -posts $posts
  
  # Pattern 1: Try <!-- FOOTER --> followed by <footer>
  $pattern1 = '(  </div>\s*</div>\s*)(<!-- FOOTER -->\s*<footer>)'
  if ($content -match $pattern1) {
    $newContent = $content -replace $pattern1, "`$1`$2`n`n$relatedHTML`n"
    Set-Content -Path $indexPath -Value $newContent
    Write-Host "Added: $dirName (Pattern 1)"
    $addedCount++
    return
  }
  
  # Pattern 2: Try immediate </div></div><footer> with flexibility
  $pattern2 = '(  </div>\s*</div>\s*)(<footer>)'
  if ($content -match $pattern2) {
    $newContent = $content -replace $pattern2, "`$1`n`n$relatedHTML`n`n`$2"
    Set-Content -Path $indexPath -Value $newContent
    Write-Host "Added: $dirName (Pattern 2)"
    $addedCount++
    return
  }
  
  # Pattern 3: Try </div></div><div class="post-nav">...</div></div><footer> (minified)
  $pattern3 = '(</div></div>)(<footer>)'
  if ($content -match $pattern3) {
    $newContent = $content -replace $pattern3, "`$1`n`n$relatedHTML`n`n`$2"
    Set-Content -Path $indexPath -Value $newContent
    Write-Host "Added: $dirName (Pattern 3)"
    $addedCount++
    return
  }
  
  # Pattern 4: Try before </body></html>
  $pattern4 = '(</div>)\s*</body>'
  if ($content -match $pattern4) {
    $newContent = $content -replace $pattern4, "`$1`n`n$relatedHTML`n`n</body>"
    Set-Content -Path $indexPath -Value $newContent
    Write-Host "Added: $dirName (Pattern 4)"
    $addedCount++
    return
  }
  
  # Pattern 5: Fragment files ending with </div></div> (no footer)
  # Handle both Unix and Windows line endings, and varying indentation
  $pattern5 = '([\s]*</div>[\r\n]+[\s]*</div>[\r\n]*)$'
  if ($content -match $pattern5) {
    $newContent = $content -replace $pattern5, "`r`n`r`n$relatedHTML`r`n`$1"
    Set-Content -Path $indexPath -Value $newContent -NoNewline
    Set-Content -Path $indexPath -Value ((Get-Content $indexPath -Raw) + "`r`n")
    Write-Host "Added: $dirName (Pattern 5)"
    $addedCount++
    return
  }
  
  # Pattern 6: Fragment files ending with </style> (embedded CSS fragments)
  $pattern6 = '(</style>[\r\n]*)$'
  if ($content -match $pattern6) {
    $newContent = $content -replace $pattern6, "`r`n`r`n$relatedHTML`r`n`r`n`$1"
    Set-Content -Path $indexPath -Value $newContent
    Write-Host "Added: $dirName (Pattern 6)"
    $addedCount++
    return
  }
  
  Write-Host "Failed: $dirName"
  $failedCount++
  $failedDirs += $dirName
}

Write-Host ""
Write-Host "======================================"
Write-Host "Completed!"
Write-Host "Added to: $addedCount files"
if ($failedCount -gt 0) {
  Write-Host "Failed: $failedCount files"
  $failedDirs | ForEach-Object { Write-Host "  - $_" }
}
if ($skippedDirs.Count -gt 0) {
  Write-Host "Skipped (no mapping): $($skippedDirs.Count) files"
  $skippedDirs | ForEach-Object { Write-Host "  - $_" }
}
