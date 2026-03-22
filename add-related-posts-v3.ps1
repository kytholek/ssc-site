# Add Related Posts - Version 3 (with proper insertion point)
# Places related posts AFTER post-nav closing tag but before post-wrap closing

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

$relatedPostsCSS = @"
    .related-posts { margin-top: 56px; padding-top: 40px; border-top: 1px solid rgba(201,168,76,0.1); }
    .related-posts-title { font-family: "Cinzel", serif; font-size: 13px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold-light); margin-bottom: 24px; }
    .related-posts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .related-post-card { padding: 16px; border: 1px solid rgba(201,168,76,0.15); border-radius: 6px; text-decoration: none; transition: all .3s; background: rgba(201,168,76,0.02); }
    .related-post-card:hover { border-color: rgba(201,168,76,0.3); background: rgba(201,168,76,0.08); transform: translateY(-2px); }
    .related-post-title { font-size: 14px; color: var(--text); line-height: 1.4; font-weight: 500; }
    .related-post-link { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: .2em; text-transform: uppercase; color: var(--teal-light); margin-top: 8px; display: block; }
"@

# Process each directory in blog folder
$blogDirs = Get-ChildItem "c:\App Projects\Website\ssc-site\ssc-site2\ssc-site\blog\" -Directory

foreach ($dir in $blogDirs) {
    $indexFile = Join-Path $dir.FullName "index.html"
    
    if (!(Test-Path $indexFile)) { continue }
    
    $dirName = $dir.Name
    
    # Check if we have related posts for this directory
    if (!$relatedPostsMap.ContainsKey($dirName)) { continue }
    
    $lines = @(Get-Content $indexFile -Encoding UTF8)
    $newLines = [System.Collections.Generic.List[string]]::new()
    
    $cssFound = $false
    $relatedPostsFound = $false
    $postNavClosingLineIndex = -1
    
    # First pass: find if CSS and related posts exist
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -like "*.related-posts*") {
            $cssFound = $true
        }
        if ($lines[$i] -like "*<div class=`"related-posts`">*") {
            $relatedPostsFound = $true
        }
        if ($lines[$i] -like "*</div>*") {
            if (($i -gt 0) -and ($lines[$i-1] -like "*  </a>*")) {
                # This might be post-nav closing (follows a post-nav-btn link)
                if (($postNavClosingLineIndex -eq -1) -and ($i -lt 150)) {
                    # Check if previous lines have post-nav-btn
                    $hasPostNav = $false
                    for ($j = [Math]::Max(0, $i-10); $j -lt $i; $j++) {
                        if ($lines[$j] -like "*post-nav-btn*") {
                            $hasPostNav = $true
                            break
                        }
                    }
                    if ($hasPostNav) {
                        $postNavClosingLineIndex = $i
                    }
                }
            }
        }
    }
    
    # If already has related-posts HTML, skip
    if ($relatedPostsFound) {
        Write-Host "OK: $dirName (already has related posts)"
        continue
    }
    
    # Second pass: add CSS if missing, then insert related posts HTML
    for ($i = 0; $i -lt $lines.Count; $i++) {
        # Add CSS before closing style tag if not present
        if (!$cssFound -and $lines[$i] -like "*</style>*") {
            $newLines.Add($relatedPostsCSS)
            $cssFound = $true
        }
        
        $newLines.Add($lines[$i])
        
        # Insert related posts after post-nav closing div
        if ($i -eq $postNavClosingLineIndex) {
            # Build related posts HTML
            $relatedHTML = "    <div class=`"related-posts`">`n    <div class=`"related-posts-title`">Related Articles</div>`n    <div class=`"related-posts-grid`">"
            
            foreach ($post in $relatedPostsMap[$dirName]) {
                $relatedHTML += "`n      <a href=`"$($post.url)`" class=`"related-post-card`">`n"
                $relatedHTML += "        <div class=`"related-post-title`">$($post.title)</div>`n"
                $relatedHTML += "        <span class=`"related-post-link`">Read More →</span>`n"
                $relatedHTML += "      </a>"
            }
            
            $relatedHTML += "`n    </div>`n  </div>"
            
            $newLines.Add("")
            $newLines.Add($relatedHTML)
        }
    }
    
    # Write back
    Set-Content -Path $indexFile -Value $newLines.ToArray() -Encoding UTF8
    Write-Host "OK: $dirName"
}

Write-Host ""
Write-Host "Done! Related posts added/fixed for all blog articles."
