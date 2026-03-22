# Add Related Posts to All 29 Blog Articles - FINAL SCRIPT

$blogs = @{
    "life-path-1-numerology" = @( 
        @('/blog/life-path-2-numerology/', 'Life Path 2: The Bridge'), 
        @('/blog/life-path-9-numerology/', 'Life Path 9: The Sage'), 
        @('/blog/path-of-transformation-1-4-7-2-5-8-3-6-9/', 'Path of Transformation') 
    );
    "life-path-2-numerology" = @( 
        @('/blog/life-path-1-numerology/', 'Life Path 1: The Initiator'), 
        @('/blog/life-path-3-numerology/', 'Life Path 3: The Creator'), 
        @('/blog/birth-name-vs-known-name-numerology/', 'Birth Name vs Known Name') 
    );
    "life-path-3-numerology" = @( 
        @('/blog/life-path-2-numerology/', 'Life Path 2: The Bridge'), 
        @('/blog/life-path-4-numerology/', 'Life Path 4: The Builder'), 
        @('/blog/electric-magnetic-aether-three-natures-of-number/', 'Electric Magnetic Aether') 
    );
    "life-path-4-numerology" = @( 
        @('/blog/life-path-3-numerology/', 'Life Path 3: The Creator'), 
        @('/blog/life-path-5-numerology/', 'Life Path 5: The Explorer'), 
        @('/blog/infinity-loop-cycles-recursion-numerology/', 'The Infinity Loop') 
    );
    "life-path-5-numerology" = @( 
        @('/blog/life-path-4-numerology/', 'Life Path 4: The Builder'), 
        @('/blog/life-path-6-numerology/', 'Life Path 6: The Care-Keeper'), 
        @('/blog/how-to-calculate-life-path-number/', 'How to Calculate Life Path') 
    );
    "life-path-6-numerology" = @( 
        @('/blog/life-path-5-numerology/', 'Life Path 5: The Explorer'), 
        @('/blog/life-path-7-numerology/', 'Life Path 7: The Seeker'), 
        @('/blog/why-seven-frequencies-numerology/', 'Why Seven Frequencies') 
    );
    "life-path-7-numerology" = @( 
        @('/blog/life-path-6-numerology/', 'Life Path 6: The Care-Keeper'), 
        @('/blog/life-path-8-numerology/', 'Life Path 8: The Executor'), 
        @('/blog/shadow-side-of-numerology-numbers/', 'The Shadow Side of Numerology') 
    );
    "life-path-8-numerology" = @( 
        @('/blog/life-path-7-numerology/', 'Life Path 7: The Seeker'), 
        @('/blog/life-path-9-numerology/', 'Life Path 9: The Sage'), 
        @('/blog/master-numbers-11-22-33-numerology/', 'Master Numbers 11, 22, 33') 
    );
    "life-path-9-numerology" = @( 
        @('/blog/life-path-8-numerology/', 'Life Path 8: The Executor'), 
        @('/blog/3-6-9-pattern-tesla-numerology/', 'The 3-6-9 Pattern'), 
        @('/blog/666-numerology-meaning/', '666: The Sustaining Number') 
    );
    "3-6-9-pattern-tesla-numerology" = @( 
        @('/blog/life-path-9-numerology/', 'Life Path 9: The Sage'), 
        @('/blog/666-numerology-meaning/', '666: The Sustaining Number'), 
        @('/blog/master-numbers-11-22-33-numerology/', 'Master Numbers 11, 22, 33') 
    );
    "666-numerology-meaning" = @( 
        @('/blog/3-6-9-pattern-tesla-numerology/', 'The 3-6-9 Pattern'), 
        @('/blog/angel-numbers-being-read-wrong/', 'Angel Numbers Being Read Wrong'), 
        @('/blog/master-numbers-11-22-33-numerology/', 'Master Numbers 11, 22, 33') 
    );
    "angel-numbers-being-read-wrong" = @( 
        @('/blog/666-numerology-meaning/', '666: The Sustaining Number'), 
        @('/blog/pythagorean-vs-chaldean-numerology/', 'Pythagorean vs Chaldean'), 
        @('/blog/life-path-number-explained/', 'Life Path Number Explained') 
    );
    "birth-name-vs-known-name-numerology" = @( 
        @('/blog/life-path-2-numerology/', 'Life Path 2: The Bridge'), 
        @('/blog/name-change-numerology-simulation/', 'Name Change Numerology'), 
        @('/blog/how-to-calculate-life-path-number/', 'How to Calculate Life Path') 
    );
    "codex-architecture-consciousness-matrix" = @( 
        @('/blog/decoding-the-matrix-simulation-source-code/', 'Decoding the Matrix'), 
        @('/blog/simulation-theory-numerology-source-code/', 'Simulation Theory'), 
        @('/blog/why-seven-frequencies-numerology/', 'Why Seven Frequencies') 
    );
    "decoding-the-matrix-simulation-source-code" = @( 
        @('/blog/codex-architecture-consciousness-matrix/', 'The Codex Architecture'), 
        @('/blog/simulation-theory-numerology-source-code/', 'Simulation Theory'), 
        @('/blog/why-seven-frequencies-numerology/', 'Why Seven Frequencies') 
    );
    "electric-magnetic-aether-three-natures-of-number" = @( 
        @('/blog/life-path-3-numerology/', 'Life Path 3: The Creator'), 
        @('/blog/simulation-theory-numerology-source-code/', 'Simulation Theory'), 
        @('/blog/why-seven-frequencies-numerology/', 'Why Seven Frequencies') 
    );
    "how-to-calculate-life-path-number" = @( 
        @('/blog/life-path-number-explained/', 'Life Path Number Explained'), 
        @('/blog/pythagorean-vs-chaldean-numerology/', 'Pythagorean vs Chaldean'), 
        @('/blog/birth-name-vs-known-name-numerology/', 'Birth Name vs Known Name') 
    );
    "infinity-loop-cycles-recursion-numerology" = @( 
        @('/blog/life-path-4-numerology/', 'Life Path 4: The Builder'), 
        @('/blog/path-of-transformation-1-4-7-2-5-8-3-6-9/', 'Path of Transformation'), 
        @('/blog/3-6-9-pattern-tesla-numerology/', 'The 3-6-9 Pattern') 
    );
    "life-path-number-explained" = @( 
        @('/blog/how-to-calculate-life-path-number/', 'How to Calculate Life Path'), 
        @('/blog/path-of-transformation-1-4-7-2-5-8-3-6-9/', 'Path of Transformation'), 
        @('/blog/pythagorean-vs-chaldean-numerology/', 'Pythagorean vs Chaldean') 
    );
    "master-numbers-11-22-33-numerology" = @( 
        @('/blog/life-path-8-numerology/', 'Life Path 8: The Executor'), 
        @('/blog/3-6-9-pattern-tesla-numerology/', 'The 3-6-9 Pattern'), 
        @('/blog/life-path-number-explained/', 'Life Path Number Explained') 
    );
    "name-change-numerology-simulation" = @( 
        @('/blog/birth-name-vs-known-name-numerology/', 'Birth Name vs Known Name'), 
        @('/blog/how-to-calculate-life-path-number/', 'How to Calculate Life Path'), 
        @('/blog/pythagorean-vs-chaldean-numerology/', 'Pythagorean vs Chaldean') 
    );
    "path-of-transformation-1-4-7-2-5-8-3-6-9" = @( 
        @('/blog/life-path-1-numerology/', 'Life Path 1: The Initiator'), 
        @('/blog/infinity-loop-cycles-recursion-numerology/', 'The Infinity Loop'), 
        @('/blog/life-path-number-explained/', 'Life Path Number Explained') 
    );
    "pythagorean-vs-chaldean-numerology" = @( 
        @('/blog/how-to-calculate-life-path-number/', 'How to Calculate Life Path'), 
        @('/blog/life-path-number-explained/', 'Life Path Number Explained'), 
        @('/blog/angel-numbers-being-read-wrong/', 'Angel Numbers Being Read Wrong') 
    );
    "shadow-side-of-numerology-numbers" = @( 
        @('/blog/life-path-7-numerology/', 'Life Path 7: The Seeker'), 
        @('/blog/simulation-theory-numerology-source-code/', 'Simulation Theory'), 
        @('/blog/why-seven-frequencies-numerology/', 'Why Seven Frequencies') 
    );
    "simulation-theory-numerology-source-code" = @( 
        @('/blog/codex-architecture-consciousness-matrix/', 'The Codex Architecture'), 
        @('/blog/decoding-the-matrix-simulation-source-code/', 'Decoding the Matrix'), 
        @('/blog/why-seven-frequencies-numerology/', 'Why Seven Frequencies') 
    );
    "theme-number-birth-year-numerology" = @( 
        @('/blog/path-of-transformation-1-4-7-2-5-8-3-6-9/', 'Path of Transformation'), 
        @('/blog/why-seven-frequencies-numerology/', 'Why Seven Frequencies'), 
        @('/blog/life-path-number-explained/', 'Life Path Number Explained') 
    );
    "why-seven-frequencies-numerology" = @( 
        @('/blog/codex-architecture-consciousness-matrix/', 'The Codex Architecture'), 
        @('/blog/decoding-the-matrix-simulation-source-code/', 'Decoding the Matrix'), 
        @('/blog/simulation-theory-numerology-source-code/', 'Simulation Theory') 
    );
    "evolution-of-energy-0-through-9" = @( 
        @('/blog/3-6-9-pattern-tesla-numerology/', 'The 3-6-9 Pattern'), 
        @('/blog/why-seven-frequencies-numerology/', 'Why Seven Frequencies'), 
        @('/blog/simulation-theory-numerology-source-code/', 'Simulation Theory') 
    );
    "five-lenses-of-self-ego-mind-soul-spirit-void" = @( 
        @('/blog/life-path-5-numerology/', 'Life Path 5: The Explorer'), 
        @('/blog/shadow-side-of-numerology-numbers/', 'The Shadow Side of Numerology'), 
        @('/blog/why-seven-frequencies-numerology/', 'Why Seven Frequencies') 
    );
}

$count = 0
$skipped = 0

foreach ($d in (Get-ChildItem "c:\App Projects\Website\ssc-site\ssc-site2\ssc-site\blog" -Directory)) {
    if ($blogs.Keys -notcontains $d.Name) { continue }
    
    $f = "$($d.FullName)\index.html"
    if (!(Test-Path $f)) { continue }
    
    $c = Get-Content $f -Raw -Encoding UTF8
    
    if ($c -like "*related-posts*") { 
        Write-Host "Skip: $($d.Name) (already has related posts)"
        $skipped++
        continue 
    }
    
    # Build HTML
    $h = "  " + '<div class="related-posts">' + "`n" + '    <div class="related-posts-title">Related Articles</div>' + "`n" + '    <div class="related-posts-grid">' + "`n"
    
    foreach ($p in $blogs[$d.Name]) {
        $h += "      " + '<a href="' + $p[0] + '" class="related-post-card">' + "`n"
        $h += "        " + '<div class="related-post-title">' + $p[1] + '</div>' + "`n"
        $h += "        " + '<span class="related-post-link">Read More</span>' + "`n"
        $h += "      " + '</a>' + "`n"
    }
    
    $h += "    " + "</div>" + "`n" + "  " + "</div>"
    
    # Replace before footer (handles both with and without <!-- FOOTER --> comment)
    $nc = $c -replace '(  </div>\s*</div>\s*(?:<!-- FOOTER -->\s*)?)<footer>', ('$1' + "`n`n" + $h + "`n`n" + '<footer>')
    
    if ($nc -ne $c) {
        Set-Content $f -Value $nc -Encoding UTF8 -Force
        Write-Host "Added: $($d.Name)"
        $count++
    } else {
        Write-Host "Failed: $($d.Name) (pattern not matched)"
    }
}

Write-Host ""
Write-Host "======================================"
Write-Host "Completed!"
Write-Host "Added to: $count files"
Write-Host "Skipped: $skipped files"
Write-Host "======================================"
