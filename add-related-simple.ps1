# Simplest possible approach - replaces footer line directly

$map = @{ 
    "life-path-5-numerology" = @(
        @{u="/blog/life-path-4-numerology/";t="Life Path 4: The Builder"},
        @{u="/blog/life-path-6-numerology/";t="Life Path 6: The Care-Keeper"},
        @{u="/blog/how-to-calculate-life-path-number/";t="How to Calculate Life Path"}
    )
}

$blog = "c:\App Projects\Website\ssc-site\ssc-site2\ssc-site\blog"

foreach ($d in (Get-ChildItem $blog -Directory)) {
    if (-not ($map.Keys -contains $d.Name)) { continue }
    
    $f = "$($d.FullName)\index.html"
    if (-not (Test-Path $f)) { continue }
    
    $c = Get-Content $f -Raw -Encoding UTF8
    if ($c -like "*related-posts*") { 
        Write-Host "Skip: $($d.Name)"
        continue 
    }
    
    # Build HTML as text (no special chars)
    $html = "  " + [char]60 + "div class=" + [char]34 + "related-posts" + [char]34 + [char]62
    $html += "`n    " + [char]60 + "div class=" + [char]34 + "related-posts-title" + [char]34 + [char]62 + "Related Articles" + [char]60 + "/div" + [char]62
    $html += "`n    " + [char]60 + "div class=" + [char]34 + "related-posts-grid" + [char]34 + [char]62
    
    foreach ($r in $map[$d.Name]) {
        $html += "`n      " + [char]60 + "a href=" + [char]34 + $r.u + [char]34 + " class=" + [char]34 + "related-post-card" + [char]34 + [char]62
        $html += "`n        " + [char]60 + "div class=" + [char]34 + "related-post-title" + [char]34 + [char]62 + $r.t + [char]60 + "/div" + [char]62
        $html += "`n        " + [char]60 + "span class=" + [char]34 + "related-post-link" + [char]34 + [char]62 + "Read More" + [char]62 + [char]60 + "/span" + [char]62
        $html += "`n      " + [char]60 + "/a" + [char]62
    }
    
    $html += "`n    " + [char]60 + "/div" + [char]62
    $html += "`n  " + [char]60 + "/div" + [char]62
    
    # Replace just before footer
    $n = $c -replace '(  ' + [char]60 + '/div' + [char]62 + '\s*' + [char]60 + '/div' + [char]62 + '\s*\n\n)(' + [char]60 + 'footer' + [char]62 + ')', ('$1' + "`n" + $html + "`n`n" + '$2')
    
    if ($n -ne $c) {
        Set-Content $f -Value $n -Encoding UTF8 -Force
        Write-Host "Added: $($d.Name)"
    } else {
        Write-Host "Failed: $($d.Name)"
    }
}
