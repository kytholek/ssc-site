# Update all blog article navs to use shared nav system
$blogDir = "c:\App Projects\Website\ssc-site\ssc-site2\ssc-site\blog"

# Pattern to find and replace
$searchStr = '  </style>
</head>
<body>
  <nav>
    <a class="nav-logo" href="/"'

$replaceStr = '  </style>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      if (typeof loadNav === "function") loadNav();
    });
  </script>
</head>
<body>
  <nav id="main-nav"></nav>

  <div class="post-wrap" style="display:none">'

$updated = 0
Get-ChildItem -Path $blogDir -Filter "index.html" -Recurse | ForEach-Object {
  $filePath = $_.FullName
  if ($filePath -eq "c:\App Projects\Website\ssc-site\ssc-site2\ssc-site\blog\666-numerology-meaning\index.html") {
    return
  }
  
  $content = Get-Content $filePath -Raw
  
  if ($content -like "*<div class=`"nav-logo-sigil`">*") {
    # File still has old nav - needs update
    $position = $content.IndexOf("<div class=`"nav-logo-sigil`">")
    if ($position -gt 0) {
      # Find the opening <nav> tag before this
      $navStart = $content.LastIndexOf("<nav>", $position)
      if ($navStart -gt 0) {
        # Find the closing </nav> tag after nav-logo-sigil section
        $navEnd = $content.IndexOf("</nav>", $navStart) + 6
        if ($navEnd -gt $navStart) {
          # Also need the next <div class="post-wrap"> line
          $postWrapStart = $content.IndexOf("<div class=`"post-wrap`">", $navEnd)
          if ($postWrapStart -gt 0) {
            $before = $content.Substring(0, $navStart)
            $after = $content.Substring($postWrapStart)
            $newContent = $before + '<nav id="main-nav"></nav>' + "`n`n  " + $after
            $newContent = $newContent.Replace("  </style>`n</head>", '  </style>' + "`n  " + '<script>document.addEventListener("DOMContentLoaded",()=>{if(typeof loadNav==="function")loadNav();});</script>' + "`n</head>")
            Set-Content -Path $filePath -Value $newContent -Encoding UTF8
            Write-Host "✓ $($_.Name)"
            $updated++
          }
        }
      }
    }
  }
}

Write-Host ""
Write-Host "Updated $updated article(s)"
