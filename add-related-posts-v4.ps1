# Add Related Posts - Version 4 (String Replacement Only)
# Simple direct string replacement

$relatedPostsMap = @{
    "life-path-1-numerology" = @(
        @{ url = "/blog/life-path-2-numerology/"; title = "Life Path 2: The Bridge" },
        @{ url = "/blog/life-path-9-numerology/"; title = "Life Path 9: The Sage" },
        @{ url = "/blog/path-of-transformation-1-4-7-2-5-8-3-6-9/"; title = "Path of Transformation" }
    );
    "life-path-2-numerology" = @(
        @{ url = "/blog/life-path-1-numerology/"; title = "Life Path 1: The Initiator" },
        @{ url = "/blog/life-path-3-numerology/"; title = "Life Path 3: The Creator" },
        @{ url = "/blog/birth-name-vs-known-name-numerology/"; title = "Birth Name vs Known Name" }
    );
    "life-path-3-numerology" = @(
        @{ url = "/blog/life-path-2-numerology/"; title = "Life Path 2: The Bridge" },
        @{ url = "/blog/life-path-4-numerology/"; title = "Life Path 4: The Builder" },
        @{ url = "/blog/electric-magnetic-aether-three-natures-of-number/"; title = "Electric Magnetic Aether" }
    );
    "life-path-4-numerology" = @(
        @{ url = "/blog/life-path-3-numerology/"; title = "Life Path 3: The Creator" },
        @{ url = "/blog/life-path-5-numerology/"; title = "Life Path 5: The Explorer" },
        @{ url = "/blog/infinity-loop-cycles-recursion-numerology/"; title = "The Infinity Loop" }
    );
    "life-path-5-numerology" = @(
        @{ url = "/blog/life-path-4-numerology/"; title = "Life Path 4: The Builder" },
        @{ url = "/blog/life-path-6-numerology/"; title = "Life Path 6: The Care-Keeper" },
        @{ url = "/blog/how-to-calculate-life-path-number/"; title = "How to Calculate Life Path" }
    );
    "life-path-6-numerology" = @(
        @{ url = "/blog/life-path-5-numerology/"; title = "Life Path 5: The Explorer" },
        @{ url = "/blog/life-path-7-numerology/"; title = "Life Path 7: The Seeker" },
        @{ url = "/blog/why-seven-frequencies-numerology/"; title = "Why Seven Frequencies" }
    );
    "life-path-7-numerology" = @(
        @{ url = "/blog/life-path-6-numerology/"; title = "Life Path 6: The Care-Keeper" },
        @{ url = "/blog/life-path-8-numerology/"; title = "Life Path 8: The Executor" },
        @{ url = "/blog/shadow-side-of-numerology-numbers/"; title = "The Shadow Side of Numerology" }
    );
    "life-path-8-numerology" = @(
        @{ url = "/blog/life-path-7-numerology/"; title = "Life Path 7: The Seeker" },
        @{ url = "/blog/life-path-9-numerology/"; title = "Life Path 9: The Sage" },
        @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers 11, 22, 33" }
    );
    "life-path-9-numerology" = @(
        @{ url = "/blog/life-path-8-numerology/"; title = "Life Path 8: The Executor" },
        @{ url = "/blog/3-6-9-pattern-tesla-numerology/"; title = "The 3-6-9 Pattern" },
        @{ url = "/blog/666-numerology-meaning/"; title = "666: The Sustaining Number" }
    );
    "3-6-9-pattern-tesla-numerology" = @(
        @{ url = "/blog/life-path-9-numerology/"; title = "Life Path 9: The Sage" },
        @{ url = "/blog/666-numerology-meaning/"; title = "666: The Sustaining Number" },
        @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers 11, 22, 33" }
    );
    "666-numerology-meaning" = @(
        @{ url = "/blog/3-6-9-pattern-tesla-numerology/"; title = "The 3-6-9 Pattern" },
        @{ url = "/blog/angel-numbers-being-read-wrong/"; title = "Angel Numbers Being Read Wrong" },
        @{ url = "/blog/master-numbers-11-22-33-numerology/"; title = "Master Numbers 11, 22, 33" }
    );
    "angel-numbers-being-read-wrong" = @(
        @{ url = "/blog/666-numerology-meaning/"; title = "666: The Sustaining Number" },
        @{ url = "/blog/pythagorean-vs-chaldean-numerology/"; title = "Pythagorean vs Chaldean" },
        @{ url = "/blog/life-path-number-explained/"; title = "Life Path Number Explained" }
    );
    "birth-name-vs-known-name-numerology" = @(
        @{ url = "/blog/life-path-2-numerology/"; title = "Life Path 2: The Bridge" },
        @{ url = "/blog/name-change-numerology-simulation/"; title = "Name Change Numerology" },
        @{ url = "/blog/how-to-calculate-life-path-number/"; title = "How to Calculate Life Path" }
    );
    "codex-architecture-consciousness-matrix" = @(
        @{ url = "/blog/decoding-the-matrix-simulation-source-code/"; title = "Decoding the Matrix" },
        @{ url = "/blog/simulation-theory-numerology-source-code/"; title = "Simulation Theory" },
        @{ url = "/blog/why-seven-frequencies-numerology/"; title = "Why Seven Frequencies" }
    );
    "decoding-the-matrix-simulation-source-code" = @(
        @{ url = "/blog/codex-architecture-consciousness-matrix/"; title = "The Codex Architecture" },
        @{ url = "/blog/simulation-theory-numerology-source-code/"; title = "Simulation Theory" },
        @{ url = "/blog/why-seven-frequencies-numerology/"; title = "Why Seven Frequencies" }
    );
    "electric-magnetic-aether-three-natures-of-number" = @(
        @{ url = "/blog/life-path-3-numerology/"; title = "Life Path 3: The Creator" },
        @{ url = "/blog/simulation-theory-numerology-source-code/"; title = "Simulation Theory" },
        @{ url = "/blog/why-seven-frequencies-numerology/"; title = "Why Seven Frequencies" }
    );
    "how-to-calculate-life-path-number" = @(
        @{ url = "/blog/life-path-number-explained/"; title = "Life Path Number Explained" },
        @{ url = "/blog/pythagorean-vs-chaldean-numerology/"; title = "Pythagorean vs Chaldean" },
        @{ url = "/blog/birth-name-vs-known-name-numerology/"; title = "Birth Name vs Known Name" }
    );
    "infinity-loop-cycles-recursion-numerology" = @(
        @{ url = "/blog/life-path-4-numerology/"; title = "Life Path 4: The Builder" },
        @{ url = "/blog/path-of-transformation-1-4-7-2-5-8-3-6-9/"; title = "Path of Transformation" },
        @{ url = "/blog/3-6-9-pattern-tesla-numerology/"; title = "The 3-6-9 Pattern" }
    );
    "life-path-number-explained" = @(
        @{ url = "/blog/how-to-calculate-life-path-number/"; title = "How to Calculate Life Path" },
        @{ url = "/blog/path-of-transformation-1-4-7-2-5-8-3-6-9/"; title = "Path of Transformation" },
        @{ url = "/blog/pythagorean-vs-chaldean-numerology/"; title = "Pythagorean vs Chaldean" }
    );
    "master-numbers-11-22-33-numerology" = @(
        @{ url = "/blog/life-path-8-numerology/"; title = "Life Path 8: The Executor" },
        @{ url = "/blog/3-6-9-pattern-tesla-numerology/"; title = "The 3-6-9 Pattern" },
        @{ url = "/blog/life-path-number-explained/"; title = "Life Path Number Explained" }
    );
    "name-change-numerology-simulation" = @(
        @{ url = "/blog/birth-name-vs-known-name-numerology/"; title = "Birth Name vs Known Name" },
        @{ url = "/blog/how-to-calculate-life-path-number/"; title = "How to Calculate Life Path" },
        @{ url = "/blog/pythagorean-vs-chaldean-numerology/"; title = "Pythagorean vs Chaldean" }
    );
    "path-of-transformation-1-4-7-2-5-8-3-6-9" = @(
        @{ url = "/blog/life-path-1-numerology/"; title = "Life Path 1: The Initiator" },
        @{ url = "/blog/infinity-loop-cycles-recursion-numerology/"; title = "The Infinity Loop" },
        @{ url = "/blog/life-path-number-explained/"; title = "Life Path Number Explained" }
    );
    "pythagorean-vs-chaldean-numerology" = @(
        @{ url = "/blog/how-to-calculate-life-path-number/"; title = "How to Calculate Life Path" },
        @{ url = "/blog/life-path-number-explained/"; title = "Life Path Number Explained" },
        @{ url = "/blog/angel-numbers-being-read-wrong/"; title = "Angel Numbers Being Read Wrong" }
    );
    "shadow-side-of-numerology-numbers" = @(
        @{ url = "/blog/life-path-7-numerology/"; title = "Life Path 7: The Seeker" },
        @{ url = "/blog/simulation-theory-numerology-source-code/"; title = "Simulation Theory" },
        @{ url = "/blog/why-seven-frequencies-numerology/"; title = "Why Seven Frequencies" }
    );
    "simulation-theory-numerology-source-code" = @(
        @{ url = "/blog/codex-architecture-consciousness-matrix/"; title = "The Codex Architecture" },
        @{ url = "/blog/decoding-the-matrix-simulation-source-code/"; title = "Decoding the Matrix" },
        @{ url = "/blog/why-seven-frequencies-numerology/"; title = "Why Seven Frequencies" }
    );
    "theme-number-birth-year-numerology" = @(
        @{ url = "/blog/path-of-transformation-1-4-7-2-5-8-3-6-9/"; title = "Path of Transformation" },
        @{ url = "/blog/why-seven-frequencies-numerology/"; title = "Why Seven Frequencies" },
        @{ url = "/blog/life-path-number-explained/"; title = "Life Path Number Explained" }
    );
    "why-seven-frequencies-numerology" = @(
        @{ url = "/blog/codex-architecture-consciousness-matrix/"; title = "The Codex Architecture" },
        @{ url = "/blog/decoding-the-matrix-simulation-source-code/"; title = "Decoding the Matrix" },
        @{ url = "/blog/simulation-theory-numerology-source-code/"; title = "Simulation Theory" }
    );
    "evolution-of-energy-0-through-9" = @(
        @{ url = "/blog/3-6-9-pattern-tesla-numerology/"; title = "The 3-6-9 Pattern" },
        @{ url = "/blog/why-seven-frequencies-numerology/"; title = "Why Seven Frequencies" },
        @{ url = "/blog/simulation-theory-numerology-source-code/"; title = "Simulation Theory" }
    );
    "five-lenses-of-self-ego-mind-soul-spirit-void" = @(
        @{ url = "/blog/life-path-5-numerology/"; title = "Life Path 5: The Explorer" },
        @{ url = "/blog/shadow-side-of-numerology-numbers/"; title = "The Shadow Side of Numerology" },
        @{ url = "/blog/why-seven-frequencies-numerology/"; title = "Why Seven Frequencies" }
    );
}

function New-RelatedPostsHTML {
    param([array]$posts)
    
    $html = '  <div class="related-posts">' + "`n"
    $html += '    <div class="related-posts-title">Related Articles</div>' + "`n"
    $html += '    <div class="related-posts-grid">' + "`n"
    
    foreach ($post in $posts) {
        $html += '      <a href="' + $post.url + '" class="related-post-card">' + "`n"
        $html += '        <div class="related-post-title">' + $post.title + '</div>' + "`n"
        $html += '        <span class="related-post-link">Read More →</span>' + "`n"
        $html += '      </a>' + "`n"
    }
    
    $html += '    </div>' + "`n  </div>"
    return $html
}

# Process each directory
$blogDirs = Get-ChildItem "c:\App Projects\Website\ssc-site\ssc-site2\ssc-site\blog\" -Directory

$count = 0
foreach ($dir in $blogDirs) {
    $indexFile = Join-Path $dir.FullName "index.html"
    if (!(Test-Path $indexFile)) { continue }
    
    $dirName = $dir.Name
    if (!$relatedPostsMap.ContainsKey($dirName)) { continue }
    
    $content = Get-Content $indexFile -Raw -Encoding UTF8
    
    # Skip if already has related-posts HTML
    if ($content -like "*<div class=""related-posts"">*") {
        Write-Host "Already has: $dirName"
        $count++
        continue
    }
    
    # Build related posts HTML
    $relatedHTML = New-RelatedPostsHTML -posts $relatedPostsMap[$dirName]
    
    # Insert before footer - look for the pattern:  </div>\\n</div>\\n\\n<footer>
    # and replace with: </div>\\n\\n[related-posts]\\n\\n</div>\\n\\n<footer>
    $newContent = $content -replace '(  </div>\s*</div>\s*\s*)(</footer>)', "`$1`n$relatedHTML`n`n`$2"
    
    if ($newContent -ne $content) {
        Set-Content -Path $indexFile -Value $newContent -Encoding UTF8
        Write-Host "Added: $dirName"
        $count++
    } else {
        Write-Host "Failed: $dirName (pattern not matched)"
    }
}

Write-Host ""
Write-Host "Done! Processed $count directories."
