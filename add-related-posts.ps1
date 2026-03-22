# Add related posts section to all blog articles
$blogPath = "c:\App Projects\Website\ssc-site\ssc-site2\ssc-site\blog"

# Define related posts for each article
$relatedPostsMap = @{
  'life-path-1-numerology' = @(
    @{dir='life-path-2-numerology'; title='Life Path 2: The Bridge'},
    @{dir='life-path-9-numerology'; title='Life Path 9: The Sage'},
    @{dir='path-of-transformation-1-4-7-2-5-8-3-6-9'; title='Path of Transformation: 1-4-7'}
  )
  'life-path-2-numerology' = @(
    @{dir='life-path-1-numerology'; title='Life Path 1: The Initiator'},
    @{dir='life-path-3-numerology'; title='Life Path 3: The Creator'},
    @{dir='birth-name-vs-known-name-numerology'; title='Birth Name vs Known Name'}
  )
  'life-path-3-numerology' = @(
    @{dir='life-path-2-numerology'; title='Life Path 2: The Bridge'},
    @{dir='life-path-4-numerology'; title='Life Path 4: The Builder'},
    @{dir='electric-magnetic-aether-three-natures-of-number'; title='Electric, Magnetic & Aether'}
  )
  'life-path-4-numerology' = @(
    @{dir='life-path-3-numerology'; title='Life Path 3: The Creator'},
    @{dir='life-path-5-numerology'; title='Life Path 5: The Explorer'},
    @{dir='codex-architecture-consciousness-matrix'; title='The Codex: Architecture of Consciousness'}
  )
  'life-path-5-numerology' = @(
    @{dir='life-path-4-numerology'; title='Life Path 4: The Builder'},
    @{dir='life-path-6-numerology'; title='Life Path 6: The Care-Keeper'},
    @{dir='infinity-loop-cycles-recursion-numerology'; title='The Infinity Loop'}
  )
  'life-path-6-numerology' = @(
    @{dir='life-path-5-numerology'; title='Life Path 5: The Explorer'},
    @{dir='life-path-7-numerology'; title='Life Path 7: The Seeker'},
    @{dir='shadow-side-of-numerology-numbers'; title='The Shadow Side of Numbers'}
  )
  'life-path-7-numerology' = @(
    @{dir='life-path-6-numerology'; title='Life Path 6: The Care-Keeper'},
    @{dir='life-path-8-numerology'; title='Life Path 8: The Executor'},
    @{dir='pythagorean-vs-chaldean-numerology'; title='Pythagorean vs Chaldean'}
  )
  'life-path-8-numerology' = @(
    @{dir='life-path-7-numerology'; title='Life Path 7: The Seeker'},
    @{dir='life-path-9-numerology'; title='Life Path 9: The Sage'},
    @{dir='master-numbers-11-22-33-numerology'; title='Master Numbers 11, 22, 33'}
  )
  'life-path-9-numerology' = @(
    @{dir='life-path-8-numerology'; title='Life Path 8: The Executor'},
    @{dir='life-path-1-numerology'; title='Life Path 1: The Initiator'},
    @{dir='why-seven-frequencies-numerology'; title='Why Seven Frequencies'}
  )
  '3-6-9-pattern-tesla-numerology' = @(
    @{dir='decoding-the-matrix-simulation-source-code'; title='Decoding the Matrix'},
    @{dir='codex-architecture-consciousness-matrix'; title='The Codex: Architecture of Consciousness'},
    @{dir='life-path-number-explained'; title='Life Path Number Explained'}
  )
  '666-numerology-meaning' = @(
    @{dir='3-6-9-pattern-tesla-numerology'; title='The 3–6–9 Pattern'},
    @{dir='life-path-6-numerology'; title='Life Path 6: The Care-Keeper'},
    @{dir='electric-magnetic-aether-three-natures-of-number'; title='Electric, Magnetic & Aether'}
  )
  'angel-numbers-being-read-wrong' = @(
    @{dir='666-numerology-meaning'; title='666: The Sustaining Number'},
    @{dir='master-numbers-11-22-33-numerology'; title='Master Numbers 11, 22, 33'},
    @{dir='why-seven-frequencies-numerology'; title='Why Seven Frequencies'}
  )
  'birth-name-vs-known-name-numerology' = @(
    @{dir='name-change-numerology-simulation'; title='Name Change & Numerology'},
    @{dir='life-path-2-numerology'; title='Life Path 2: The Bridge'},
    @{dir='how-to-calculate-life-path-number'; title='How to Calculate Your Life Path'}
  )
  'codex-architecture-consciousness-matrix' = @(
    @{dir='decoding-the-matrix-simulation-source-code'; title='Decoding the Matrix'},
    @{dir='life-path-4-numerology'; title='Life Path 4: The Builder'},
    @{dir='why-seven-frequencies-numerology'; title='Why Seven Frequencies'}
  )
  'decoding-the-matrix-simulation-source-code' = @(
    @{dir='codex-architecture-consciousness-matrix'; title='The Codex: Architecture of Consciousness'},
    @{dir='simulation-theory-numerology-source-code'; title='Simulation Theory & Numerology'},
    @{dir='why-seven-frequencies-numerology'; title='Why Seven Frequencies'}
  )
  'electric-magnetic-aether-three-natures-of-number' = @(
    @{dir='3-6-9-pattern-tesla-numerology'; title='The 3–6–9 Pattern'},
    @{dir='evolution-of-energy-0-through-9'; title='The Evolution of Energy'},
    @{dir='life-path-3-numerology'; title='Life Path 3: The Creator'}
  )
  'evolution-of-energy-0-through-9' = @(
    @{dir='electric-magnetic-aether-three-natures-of-number'; title='Electric, Magnetic & Aether'},
    @{dir='life-path-number-explained'; title='Life Path Number Explained'},
    @{dir='why-seven-frequencies-numerology'; title='Why Seven Frequencies'}
  )
  'five-lenses-of-self-ego-mind-soul-spirit-void' = @(
    @{dir='life-path-7-numerology'; title='Life Path 7: The Seeker'},
    @{dir='shadow-side-of-numerology-numbers'; title='The Shadow Side of Numbers'},
    @{dir='codex-architecture-consciousness-matrix'; title='The Codex: Architecture of Consciousness'}
  )
  'how-to-calculate-life-path-number' = @(
    @{dir='life-path-number-explained'; title='Life Path Number Explained'},
    @{dir='birth-name-vs-known-name-numerology'; title='Birth Name vs Known Name'},
    @{dir='theme-number-birth-year-numerology'; title='Theme Number Explained'}
  )
  'infinity-loop-cycles-recursion-numerology' = @(
    @{dir='life-path-5-numerology'; title='Life Path 5: The Explorer'},
    @{dir='path-of-transformation-1-4-7-2-5-8-3-6-9'; title='Path of Transformation'},
    @{dir='evolution-of-energy-0-through-9'; title='The Evolution of Energy'}
  )
  'life-path-number-explained' = @(
    @{dir='how-to-calculate-life-path-number'; title='How to Calculate Your Life Path'},
    @{dir='life-path-1-numerology'; title='Life Path 1: The Initiator'},
    @{dir='theme-number-birth-year-numerology'; title='Theme Number Explained'}
  )
  'master-numbers-11-22-33-numerology' = @(
    @{dir='life-path-8-numerology'; title='Life Path 8: The Executor'},
    @{dir='angel-numbers-being-read-wrong'; title='How Angel Numbers Are Being Read Wrong'},
    @{dir='pythagorean-vs-chaldean-numerology'; title='Pythagorean vs Chaldean'}
  )
  'name-change-numerology-simulation' = @(
    @{dir='birth-name-vs-known-name-numerology'; title='Birth Name vs Known Name'},
    @{dir='life-path-2-numerology'; title='Life Path 2: The Bridge'},
    @{dir='life-path-number-explained'; title='Life Path Number Explained'}
  )
  'path-of-transformation-1-4-7-2-5-8-3-6-9' = @(
    @{dir='life-path-1-numerology'; title='Life Path 1: The Initiator'},
    @{dir='life-path-4-numerology'; title='Life Path 4: The Builder'},
    @{dir='life-path-7-numerology'; title='Life Path 7: The Seeker'}
  )
  'pythagorean-vs-chaldean-numerology' = @(
    @{dir='how-to-calculate-life-path-number'; title='How to Calculate Your Life Path'},
    @{dir='master-numbers-11-22-33-numerology'; title='Master Numbers 11, 22, 33'},
    @{dir='life-path-7-numerology'; title='Life Path 7: The Seeker'}
  )
  'shadow-side-of-numerology-numbers' = @(
    @{dir='life-path-6-numerology'; title='Life Path 6: The Care-Keeper'},
    @{dir='five-lenses-of-self-ego-mind-soul-spirit-void'; title='The Five Lenses'},
    @{dir='why-seven-frequencies-numerology'; title='Why Seven Frequencies'}
  )
  'simulation-theory-numerology-source-code' = @(
    @{dir='decoding-the-matrix-simulation-source-code'; title='Decoding the Matrix'},
    @{dir='codex-architecture-consciousness-matrix'; title='The Codex: Architecture of Consciousness'},
    @{dir='life-path-number-explained'; title='Life Path Number Explained'}
  )
  'theme-number-birth-year-numerology' = @(
    @{dir='how-to-calculate-life-path-number'; title='How to Calculate Your Life Path'},
    @{dir='life-path-number-explained'; title='Life Path Number Explained'},
    @{dir='why-seven-frequencies-numerology'; title='Why Seven Frequencies'}
  )
  'why-seven-frequencies-numerology' = @(
    @{dir='theme-number-birth-year-numerology'; title='Theme Number Explained'},
    @{dir='decoding-the-matrix-simulation-source-code'; title='Decoding the Matrix'},
    @{dir='codex-architecture-consciousness-matrix'; title='The Codex: Architecture of Consciousness'}
  )
}

# CSS for related posts section
$relatedPostsCSS = @"
    .related-posts { margin-top: 56px; padding-top: 40px; border-top: 1px solid rgba(201,168,76,0.1); }
    .related-posts-title { font-family: "Cinzel", serif; font-size: 13px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-light); margin-bottom: 24px; }
    .related-posts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .related-post-card { padding: 16px; border: 1px solid rgba(201,168,76,0.15); border-radius: 6px; text-decoration: none; transition: all .3s; background: rgba(201,168,76,0.02); }
    .related-post-card:hover { border-color: rgba(201,168,76,0.3); background: rgba(201,168,76,0.08); transform: translateY(-2px); }
    .related-post-title { font-size: 14px; color: var(--text); line-height: 1.4; font-weight: 500; }
    .related-post-link { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .2em; text-transform: uppercase; color: var(--teal-light); margin-top: 8px; display: block; }
"@

# Update each post
$articleCount = 0
foreach ($postDir in $relatedPostsMap.Keys) {
  $filePath = "$blogPath\$postDir\index.html"
  
  if (-not (Test-Path $filePath)) {
    Write-Host "SKIP: $postDir - file not found"
    continue
  }
  
  $content = Get-Content $filePath -Raw
  
  # Check if CSS for related posts already exists
  if ($content -notmatch '\.related-posts\s*{') {
    # Add CSS to the existing style section
    $content = $content -replace '(@media \(max-width: 640px\)[^}]*})', ($relatedPostsCSS + "`n    `$1")
  }
  
  # Build related posts HTML
  $related = $relatedPostsMap[$postDir]
  $relatedHTML = '  <div class="related-posts">' + "`n" +
                 '    <div class="related-posts-title">Related Articles</div>' + "`n" +
                 '    <div class="related-posts-grid">' + "`n"
  
  foreach ($post in $related) {
    $relatedHTML += '      <a href="/blog/' + $post.dir + '/" class="related-post-card">' + "`n" +
                    '        <div class="related-post-title">' + $post.title + '</div>' + "`n" +
                    '        <span class="related-post-link">Read More &rarr;</span>' + "`n" +
                    '      </a>' + "`n"
  }
  
  $relatedHTML += '    </div>' + "`n" + '  </div>'
  
  # Insert related posts before the closing </div> of post-wrap
  $content = $content -replace '(</div>\s*<!-- Post Nav -->)', ($relatedHTML + "`n`n" + '  <!-- Post Nav -->')
  
  Set-Content -Path $filePath -Value $content -Encoding UTF8
  $articleCount++
  Write-Host "OK: $postDir"
}

Write-Host "Done! Added related posts to $articleCount articles."
