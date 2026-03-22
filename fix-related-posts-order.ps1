# Fix order: Move related posts AFTER post-nav
$blogPath = "c:\App Projects\Website\ssc-site\ssc-site2\ssc-site\blog"

Get-ChildItem -Path "$blogPath" -Directory | Where-Object { Test-Path "$($_.FullName)\index.html" } | ForEach-Object {
  $filePath = "$($_.FullName)\index.html"
  $content = Get-Content $filePath -Raw
  
  # Match the entire related posts section (before post-nav)
  if ($content -match '(\s*<div class="related-posts">[\s\S]*?</div>\s*)(<!-- Post Nav -->)') {
    $relatedSection = $matches[1]
    $postNavComment = $matches[2]
    
    # Remove from current location
    $content = $content -replace [regex]::Escape($relatedSection + $postNavComment), $postNavComment
    
    # Find the closing </div> of post-nav and place related posts after it
    $content = $content -replace '(<!-- Post Nav -->[\s\S]*?</div>\s*)(</div>)', ('$1' + "`n" + $relatedSection + '$2')
    
    Set-Content -Path $filePath -Value $content -Encoding UTF8
    Write-Host "Fixed: $($_.Name)"
  }
}

Write-Host "Done! Related posts moved after navigation."
