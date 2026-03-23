#!/usr/bin/env powershell
# Update all blog article navs to use shared loadNav system
# Handles different nav formats across blog articles

$blogDir = "c:\App Projects\Website\ssc-site\ssc-site2\ssc-site\blog"
$skipFile = "c:\App Projects\Website\ssc-site\ssc-site2\ssc-site\blog\666-numerology-meaning\index.html"

$files = @(Get-ChildItem -Path $blogDir -Filter "index.html" -Recurse | Where-Object { $_.FullName -ne $skipFile })

Write-Host "Updating $($files.Count) blog article navs..."
Write-Host ""

$updated = 0
$skipped = 0

foreach ($file in $files) {
  $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
  
  # Check if already updated
  if ($content -match 'id="main-nav"') {
    Write-Host "Already updated: $($file.Name)"
    $skipped++
    continue
  }
  
  # Check if file has old nav structure
  if ($content -notmatch '<nav') {
    Write-Host "No nav found: $($file.Name)"
    $skipped++
    continue
  }
  
  # Step 1: Add loadNav script before </head>
  $script = "  <script>" + [Environment]::NewLine + "    document.addEventListener('DOMContentLoaded', () => {" + [Environment]::NewLine + "      if (typeof loadNav === 'function') loadNav();" + [Environment]::NewLine + "    });" + [Environment]::NewLine + "  </script>"
  $content = $content -replace '(\s*</head>)', ($script + [Environment]::NewLine + '$1')
  
  # Step 2: Replace entire nav element with placeholder
  $content = $content -replace '<nav[^>]*>[\s\S]*?</nav>', '<nav id="main-nav"></nav>'
  
  # Write back
  [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
  Write-Host "Updated: $($file.Name)"
  $updated++
}

Write-Host ""
Write-Host "Updated: $updated article(s)"
Write-Host "Skipped: $skipped article(s)"
