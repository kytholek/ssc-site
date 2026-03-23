#!/usr/bin/env powershell
# Fix duplicate nav placeholders - only first nav should be main-nav

$blogDir = "c:\App Projects\Website\ssc-site\ssc-site2\ssc-site\blog"

$files = @(Get-ChildItem -Path $blogDir -Filter "index.html" -Recurse)

Write-Host "Checking for duplicate nav placeholders..."
Write-Host ""

$fixed = 0

foreach ($file in $files) {
  $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
  
  # Count how many nav id="main-nav" exist
  $matches = [regex]::Matches($content, '<nav id="main-nav"></nav>')
  
  if ($matches.Count -gt 1) {
    # Replace all with just closing, then add back ONE at the start
    $content = $content -replace '<nav id="main-nav"></nav>', '<nav class="breadcrumb">'
    $content = $content -replace '<!-- NAV -->', '<!-- NAV -->
<nav id="main-nav"></nav>'
    
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Fixed: $($file.Name) (had $($matches.Count) duplicates)"
    $fixed++
  }
}

Write-Host ""
Write-Host "Fixed: $fixed article(s)"
