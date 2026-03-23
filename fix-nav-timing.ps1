#!/usr/bin/env powershell
# Fix loadNav timing - move call from head to after app.js loads

$blogDir = "c:\App Projects\Website\ssc-site\ssc-site2\ssc-site\blog"

$files = @(Get-ChildItem -Path $blogDir -Filter "index.html" -Recurse)

Write-Host "Fixing loadNav timing for $(($files).Count) blog articles..."
Write-Host ""

$fixed = 0

foreach ($file in $files) {
  $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
  
  # Check if this file still has old timing (loadNav in head)
  if ($content -match 'addEventListener.*loadNav' -and $content -match '</head>.*</head>') {
    # Remove the loadNav call from head
    $content = $content -replace '(\s*<script>\s*// Load shared navigation[\s\S]*?</script>\s*</head>)', '</head>'
    
    # Add loadNav call after app.js
    $content = $content -replace '(<script src="/js/app.js"></script>)', "$1`n  <script>`n    // Load shared nav after app.js is ready`n    if (typeof loadNav === 'function') loadNav();`n  </script>"
    
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    Write-Host "✓ $($file.Name)"
    $fixed++
  }
}

Write-Host ""
Write-Host "Fixed: $fixed article(s)"
