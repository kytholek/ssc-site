# Update all blog posts with proper prev/next navigation
$blogPath = "c:\App Projects\Website\ssc-site\ssc-site2\ssc-site\blog"

$articles = @(
  @{dir='life-path-1-numerology'; title='Life Path 1: The Initiator'},
  @{dir='life-path-2-numerology'; title='Life Path 2: The Bridge'},
  @{dir='life-path-3-numerology'; title='Life Path 3: The Creator'},
  @{dir='life-path-4-numerology'; title='Life Path 4: The Builder'},
  @{dir='life-path-5-numerology'; title='Life Path 5: The Explorer'},
  @{dir='life-path-6-numerology'; title='Life Path 6: The Care-Keeper'},
  @{dir='life-path-7-numerology'; title='Life Path 7: The Seeker'},
  @{dir='life-path-8-numerology'; title='Life Path 8: The Executor'},
  @{dir='life-path-9-numerology'; title='Life Path 9: The Sage'},
  @{dir='3-6-9-pattern-tesla-numerology'; title='The 3–6–9 Pattern'},
  @{dir='666-numerology-meaning'; title='666: The Sustaining Number'},
  @{dir='angel-numbers-being-read-wrong'; title='How Angel Numbers Are Being Read Wrong'},
  @{dir='birth-name-vs-known-name-numerology'; title='Birth Name vs Known Name'},
  @{dir='codex-architecture-consciousness-matrix'; title='The Codex: Architecture of Consciousness'},
  @{dir='decoding-the-matrix-simulation-source-code'; title='Decoding the Matrix'},
  @{dir='electric-magnetic-aether-three-natures-of-number'; title='Electric, Magnetic & Aether'},
  @{dir='evolution-of-energy-0-through-9'; title='The Evolution of Energy'},
  @{dir='five-lenses-of-self-ego-mind-soul-spirit-void'; title='The Five Lenses'},
  @{dir='how-to-calculate-life-path-number'; title='How to Calculate Your Life Path'},
  @{dir='infinity-loop-cycles-recursion-numerology'; title='The Infinity Loop'},
  @{dir='life-path-number-explained'; title='Life Path Number Explained'},
  @{dir='master-numbers-11-22-33-numerology'; title='Master Numbers 11, 22, 33'},
  @{dir='name-change-numerology-simulation'; title='Name Change & Numerology'},
  @{dir='path-of-transformation-1-4-7-2-5-8-3-6-9'; title='Path of Transformation'},
  @{dir='pythagorean-vs-chaldean-numerology'; title='Pythagorean vs Chaldean'},
  @{dir='shadow-side-of-numerology-numbers'; title='The Shadow Side of Numbers'},
  @{dir='simulation-theory-numerology-source-code'; title='Simulation Theory & Numerology'},
  @{dir='theme-number-birth-year-numerology'; title='Theme Number Explained'},
  @{dir='why-seven-frequencies-numerology'; title='Why Seven Frequencies'}
)

for ($i = 0; $i -lt $articles.Count; $i++) {
  $current = $articles[$i]
  $prevArticle = if ($i -gt 0) { $articles[$i - 1] } else { $null }
  $nextArticle = if ($i -lt $articles.Count - 1) { $articles[$i + 1] } else { $null }
  
  $filePath = "$blogPath\$($current.dir)\index.html"
  
  if (-not (Test-Path $filePath)) {
    Write-Host "SKIP: $($current.dir) - file not found"
    continue
  }
  
  # Build the navigation HTML
  if ($prevArticle) {
    $prevBtn = '<a class="post-nav-btn prev" href="/blog/' + $prevArticle.dir + '/">' + "`n" +
               '      <span class="post-nav-hint">&larr; Previous</span>' + "`n" +
               '      <span class="post-nav-title">' + $prevArticle.title + '</span>' + "`n" +
               '    </a>'
  } else {
    $prevBtn = '    <span class="post-nav-empty"></span>'
  }
  
  if ($nextArticle) {
    $nextBtn = '<a class="post-nav-btn next" href="/blog/' + $nextArticle.dir + '/">' + "`n" +
               '      <span class="post-nav-hint">Next &rarr;</span>' + "`n" +
               '      <span class="post-nav-title">' + $nextArticle.title + '</span>' + "`n" +
               '    </a>'
  } else {
    $nextBtn = '    <span class="post-nav-empty"></span>'
  }
  
  $newNav = '  <div class="post-nav">' + "`n" + $prevBtn + "`n" + $nextBtn + "`n" + '  </div>'
  
  # Read the file
  $content = Get-Content $filePath -Raw
  
  # Replace the post-nav section
  $pattern = '<div class="post-nav">[\s\S]*?</div>'
  $content = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $newNav)
  
  # Write back
  Set-Content -Path $filePath -Value $content -Encoding UTF8
  Write-Host "OK: $($current.dir)"
}

Write-Host "Done! All blog posts updated with prev/next navigation."
