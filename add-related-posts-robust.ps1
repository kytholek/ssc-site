#!/usr/bin/env pwsh
# Robust script to add related posts to all 29 blog articles
# Handles multiple footer patterns: comments, inline, and fragments

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
    @{ url = "/blog/life-path-number-4-soul-urge/"; title = "Life Path Number 4 Soul Urge" }
  )
  "life-path-5-numerology" = @(
    @{ url = "/blog/life-path-3-numerology/"; title = "Life Path 3: The Creator" }
    @{ url = "/blog/life-path-7-numerology/"; title = "Life Path 7: The Seeker" }
    @{ url = "/blog/evolution-of-consciousness/"; title = "Evolution of Consciousness" }
  )
  "life-path-6-numerology" = @(
    @{ url = "/blog/life-path-3-numerology/"; title = "Life Path 3: The Creator" }
    @{ url = "/blog/life-path-9-numerology/"; title = "Life Path 9: The Sage" }
    @{ url = "/blog/shadow-side-numerology/"; title = "Shadow Side: Numerology" }
  )
  "life-path-7-numerology" = @(
    @{ url = "/blog/life-path-4-numerology/"; title = "Life Path 4: The Foundation" }
    @{ url = "/blog/life-path-5-numerology/"; title = "Life Path 5: The Explorer" }
    @{ url = "/blog/why-seven-numerology/"; title = "Why Seven? Numerology" }
  )
  "life-path-8-numerology" = @(
    @{ url = "/blog/life-path-5-numerology/"; title = "Life Path 5: The Explorer" }
    @{ url = "/blog/life-path-1-numerology/"; title = "Life Path 1: The Initiator" }
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers (11, 22, 33)" }
  )
  "life-path-9-numerology" = @(
    @{ url = "/blog/life-path-6-numerology/"; title = "Life Path 6: The Healer" }
    @{ url = "/blog/life-path-3-numerology/"; title = "Life Path 3: The Creator" }
    @{ url = "/blog/3-6-9-pattern-tesla-numerology/"; title = "3-6-9 Pattern: Tesla & Numerology" }
  )
  "3-6-9-pattern-tesla-numerology" = @(
    @{ url = "/blog/life-path-9-numerology/"; title = "Life Path 9: The Sage" }
    @{ url = "/blog/666-meaning-numerology/"; title = "666 Meaning: Numerology & Numerals" }
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers (11, 22, 33)" }
  )
  "666-meaning-numerology" = @(
    @{ url = "/blog/3-6-9-pattern-tesla-numerology/"; title = "3-6-9 Pattern: Tesla & Numerology" }
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers (11, 22, 33)" }
    @{ url = "/blog/life-path-6-numerology/"; title = "Life Path 6: The Healer" }
  )
  "angel-numbers-11-22-33-44-55-66-77-88-99" = @(
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers (11, 22, 33)" }
    @{ url = "/blog/life-path-11-lifepath-2-with-master-number-11/"; title = "Life Path 11: Master Number" }
    @{ url = "/blog/angel-numbers/"; title = "Angel Numbers" }
  )
  "birth-name-vs-known-name-numerology" = @(
    @{ url = "/blog/life-path-2-numerology/"; title = "Life Path 2: The Bridge" }
    @{ url = "/blog/name-change-numerology/"; title = "Name Change Numerology" }
    @{ url = "/blog/calculate-life-path-number/"; title = "How to Calculate Your Life Path Number" }
  )
  "codex-architecture-simulation-source-code" = @(
    @{ url = "/blog/decoding-the-matrix-christ-the-resurrection/"; title = "Decoding the Matrix: Christ & Resurrection" }
    @{ url = "/blog/simulation-theory-the-simulation-hypothesis/"; title = "Simulation Theory: Hypothesis" }
    @{ url = "/blog/five-lenses-of-reality/"; title = "Five Lenses of Reality" }
  )
  "decoding-the-matrix-christ-the-resurrection" = @(
    @{ url = "/blog/codex-architecture-simulation-source-code/"; title = "Codex Architecture: Simulation Source Code" }
    @{ url = "/blog/simulation-theory-the-simulation-hypothesis/"; title = "Simulation Theory: Hypothesis" }
    @{ url = "/blog/electric-magnetic-aether-frequency-vibration/"; title = "Electric & Magnetic: Aether, Frequency, Vibration" }
  )
  "electric-magnetic-aether-frequency-vibration" = @(
    @{ url = "/blog/decoding-the-matrix-christ-the-resurrection/"; title = "Decoding the Matrix: Christ & Resurrection" }
    @{ url = "/blog/five-lenses-of-reality/"; title = "Five Lenses of Reality" }
    @{ url = "/blog/simulation-theory-the-simulation-hypothesis/"; title = "Simulation Theory: Hypothesis" }
  )
  "evolution-of-consciousness" = @(
    @{ url = "/blog/five-lenses-of-reality/"; title = "Five Lenses of Reality" }
    @{ url = "/blog/life-path-5-numerology/"; title = "Life Path 5: The Explorer" }
    @{ url = "/blog/simulation-theory-the-simulation-hypothesis/"; title = "Simulation Theory: Hypothesis" }
  )
  "five-lenses-of-reality" = @(
    @{ url = "/blog/codex-architecture-simulation-source-code/"; title = "Codex Architecture: Simulation Source Code" }
    @{ url = "/blog/electric-magnetic-aether-frequency-vibration/"; title = "Electric & Magnetic: Aether, Frequency, Vibration" }
    @{ url = "/blog/evolution-of-consciousness/"; title = "Evolution of Consciousness" }
  )
  "calculate-life-path-number" = @(
    @{ url = "/blog/pythagorean-numerology-system/"; title = "Pythagorean Numerology System" }
    @{ url = "/blog/birth-name-vs-known-name-numerology/"; title = "Birth Name vs. Known Name" }
    @{ url = "/blog/name-change-numerology/"; title = "Name Change Numerology" }
  )
  "infinity-loop-time-simulation" = @(
    @{ url = "/blog/simulation-theory-the-simulation-hypothesis/"; title = "Simulation Theory: Hypothesis" }
    @{ url = "/blog/life-path-8-numerology/"; title = "Life Path 8: The Organizer" }
    @{ url = "/blog/codex-architecture-simulation-source-code/"; title = "Codex Architecture" }
  )
  "life-path-number-meaning-calculation-destiny" = @(
    @{ url = "/blog/calculate-life-path-number/"; title = "How to Calculate Your Life Path Number" }
    @{ url = "/blog/birth-name-vs-known-name-numerology/"; title = "Birth Name vs. Known Name" }
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers (11, 22, 33)" }
  )
  "master-numbers-11-22-33-numerology" = @(
    @{ url = "/blog/3-6-9-pattern-tesla-numerology/"; title = "3-6-9 Pattern: Tesla & Numerology" }
    @{ url = "/blog/angel-numbers-11-22-33-44-55-66-77-88-99/"; title = "Angel Numbers" }
    @{ url = "/blog/life-path-11-lifepath-2-with-master-number-11/"; title = "Life Path 11: Master Number" }
  )
  "name-change-numerology" = @(
    @{ url = "/blog/birth-name-vs-known-name-numerology/"; title = "Birth Name vs. Known Name" }
    @{ url = "/blog/life-path-2-numerology/"; title = "Life Path 2: The Bridge" }
    @{ url = "/blog/calculate-life-path-number/"; title = "How to Calculate Your Life Path Number" }
  )
  "path-of-transformation-1-4-7-2-5-8-3-6-9" = @(
    @{ url = "/blog/life-path-1-numerology/"; title = "Life Path 1: The Initiator" }
    @{ url = "/blog/life-path-4-numerology/"; title = "Life Path 4: The Foundation" }
    @{ url = "/blog/life-path-7-numerology/"; title = "Life Path 7: The Seeker" }
  )
  "pythagorean-numerology-system" = @(
    @{ url = "/blog/calculate-life-path-number/"; title = "How to Calculate Your Life Path Number" }
    @{ url = "/blog/life-path-number-meaning-calculation-destiny/"; title = "Life Path Number: Meaning" }
    @{ url = "/blog/birth-name-vs-known-name-numerology/"; title = "Birth Name vs. Known Name" }
  )
  "shadow-side-numerology" = @(
    @{ url = "/blog/life-path-6-numerology/"; title = "Life Path 6: The Healer" }
    @{ url = "/blog/life-path-8-numerology/"; title = "Life Path 8: The Organizer" }
    @{ url = "/blog/evolution-of-consciousness/"; title = "Evolution of Consciousness" }
  )
  "simulation-theory-the-simulation-hypothesis" = @(
    @{ url = "/blog/codex-architecture-simulation-source-code/"; title = "Codex Architecture: Simulation Source Code" }
    @{ url = "/blog/decoding-the-matrix-christ-the-resurrection/"; title = "Decoding the Matrix: Christ & Resurrection" }
    @{ url = "/blog/infinity-loop-time-simulation/"; title = "Infinity Loop: Time & Simulation" }
  )
  "theme-number-destiny-number-numerology" = @(
    @{ url = "/blog/life-path-number-meaning-calculation-destiny/"; title = "Life Path Number: Meaning" }
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers (11, 22, 33)" }
    @{ url = "/blog/pythagorean-numerology-system/"; title = "Pythagorean Numerology System" }
  )
  "why-seven-numerology" = @(
    @{ url = "/blog/life-path-7-numerology/"; title = "Life Path 7: The Seeker" }
    @{ url = "/blog/3-6-9-pattern-tesla-numerology/"; title = "3-6-9 Pattern: Tesla & Numerology" }
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers (11, 22, 33)" }
  )
  "life-path-11-lifepath-2-with-master-number-11" = @(
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers (11, 22, 33)" }
    @{ url = "/blog/life-path-2-numerology/"; title = "Life Path 2: The Bridge" }
    @{ url = "/blog/angel-numbers-11-22-33-44-55-66-77-88-99/"; title = "Angel Numbers" }
  )
  "angel-numbers" = @(
    @{ url = "/blog/angel-numbers-11-22-33-44-55-66-77-88-99/"; title = "Angel Numbers" }
    @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers (11, 22, 33)" }
    @{ url = "/blog/life-path-9-numerology/"; title = "Life Path 9: The Sage" }
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

Get-ChildItem -Path $blogDir -Directory | ForEach-Object {
  $dirName = $_.Name
  
  # Skip if no mapping exists
  if (-not $relatedPostsHTML.ContainsKey($dirName)) {
    return
  }
  
  $indexPath = Join-Path $_.FullName "index.html"
  
  if (-not (Test-Path $indexPath)) {
    return
  }
  
  $content = Get-Content $indexPath -Raw
  
  # Skip if already has related-posts
  if ($content -match 'class="related-posts"') {
    Write-Host "Already added: $dirName"
    return
  }
  
  $posts = $relatedPostsHTML[$dirName]
  $relatedHTML = Get-RelatedPostsHTML -posts $posts
  
  # Pattern 1: Try <!-- FOOTER --> followed by <footer>
  $pattern1 = '(  </div>\s*</div>\s*)(<!-- FOOTER -->\s*<footer>)'
  if ($content -match $pattern1) {
    $newContent = $content -replace $pattern1, "`$1`$2`n`n$relatedHTML`n"
    Set-Content -Path $indexPath -Value $newContent
    Write-Host "Added: $dirName (Pattern 1 - FOOTER comment)"
    $addedCount++
    return
  }
  
  # Pattern 2: Try immediate </div></div><footer> with flexibility
  $pattern2 = '(  </div>\s*</div>\s*)(<footer>)'
  if ($content -match $pattern2) {
    $newContent = $content -replace $pattern2, "`$1`n`n$relatedHTML`n`n`$2"
    Set-Content -Path $indexPath -Value $newContent
    Write-Host "Added: $dirName (Pattern 2 - standard footer)"
    $addedCount++
    return
  }
  
  # Pattern 3: Try </div></div><div class="post-nav">...</div></div><footer> (minified)
  $pattern3 = '(</div></div>)(<footer>)'
  if ($content -match $pattern3) {
    $newContent = $content -replace $pattern3, "`$1`n`n$relatedHTML`n`n`$2"
    Set-Content -Path $indexPath -Value $newContent
    Write-Host "Added: $dirName (Pattern 3 - minified footer)"
    $addedCount++
    return
  }
  
  # Pattern 4: Try before </body></html>
  $pattern4 = '(</div>)\s*</body>'
  if ($content -match $pattern4) {
    $newContent = $content -replace $pattern4, "`$1`n`n$relatedHTML`n`n</body>"
    Set-Content -Path $indexPath -Value $newContent
    Write-Host "Added: $dirName (Pattern 4 - before body)"
    $addedCount++
    return
  }
  
  # Pattern 5: Fragment files ending with </div></div> (no footer)
  # These are dynamically loaded fragments, so insert before final closing divs
  # Handle both Unix and Windows line endings
  $pattern5 = '([\r\n]+    </div>[\r\n]+  </div>[\r\n]*)$'
  if ($content -match $pattern5) {
    $newContent = $content -replace $pattern5, "`r`n`r`n$relatedHTML`r`n`$1"
    Set-Content -Path $indexPath -Value $newContent -NoNewline
    Set-Content -Path $indexPath -Value ((Get-Content $indexPath -Raw) + "`r`n") # Ensure ends with newline
    Write-Host "Added: $dirName (Pattern 5 - fragment without footer)"
    $addedCount++
    return
  }
  
  Write-Host "Failed: $dirName - No matching pattern found"
  $failedCount++
  $failedDirs += $dirName
}

Write-Host ""
Write-Host "======================================"
Write-Host "Completed!"
Write-Host "Added to: $addedCount files"
Write-Host "Failed: $failedCount files"

if ($failedCount -gt 0) {
  Write-Host ""
  Write-Host "Failed directories:"
  $failedDirs | ForEach-Object { Write-Host "  - $_" }
}
