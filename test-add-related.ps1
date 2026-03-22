# Add Related Posts - Working Version

$blogs = @{
    "life-path-5-numerology" = @( @('/blog/life-path-4-numerology/', 'Life Path 4: The Builder'), @('/blog/life-path-6-numerology/', 'Life Path 6: The Care-Keeper'), @('/blog/how-to-calculate-life-path-number/', 'How to Calculate Life Path') );
    "life-path-3-numerology" = @( @('/blog/life-path-2-numerology/', 'Life Path 2: The Bridge'), @('/blog/life-path-4-numerology/', 'Life Path 4: The Builder'), @('/blog/electric-magnetic-aether-three-natures-of-number/', 'Electric Magnetic Aether') );
}

foreach ($d in (Get-ChildItem "c:\App Projects\Website\ssc-site\ssc-site2\ssc-site\blog" -Directory)) {
    if ($blogs.Keys -notcontains $d.Name) { continue }
    
    $f = "$($d.FullName)\index.html"
    if (!(Test-Path $f)) { continue }
    
    $c = Get-Content $f -Raw -Encoding UTF8
    if ($c -like "*related-posts*") { Write-Host "Skip: $($d.Name)"; continue }
    
    $h = "  " + '<div class="related-posts">' + "`n" + '    <div class="related-posts-title">Related Articles</div>' + "`n" + '    <div class="related-posts-grid">' + "`n"
    
    foreach ($p in $blogs[$d.Name]) {
        $h += "      " + '<a href="' + $p[0] + '" class="related-post-card">' + "`n"
        $h += "        " + '<div class="related-post-title">' + $p[1] + '</div>' + "`n"
        $h += "        " + '<span class="related-post-link">Read More</span>' + "`n"
        $h += "      " + '</a>' + "`n"
    }
    
    $h += "    " + "</div>" + "`n" + "  " + "</div>"
    
    $nc = $c -replace '(  </div>\s*</div>)(\s*<footer>)', ('$1' + "`n`n" + $h + "`n`n" + '$2')
    
    if ($nc -ne $c) {
        Set-Content $f -Value $nc -Encoding UTF8
        Write-Host "Added: $($d.Name)"
    }
}

Write-Host "Done"
