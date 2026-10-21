# Tiny static file server for local previews (no Python/Node needed).
# Usage: powershell -ExecutionPolicy Bypass -File serve.ps1 -Root site -Port 8080
param([string]$Root = "site", [int]$Port = 8080)

$Root = (Resolve-Path (Join-Path $PSScriptRoot $Root)).Path
$types = @{
  ".html" = "text/html; charset=utf-8"; ".css" = "text/css"; ".js" = "text/javascript"
  ".png" = "image/png"; ".jpg" = "image/jpeg"; ".jpeg" = "image/jpeg"; ".webp" = "image/webp"
  ".svg" = "image/svg+xml"; ".ico" = "image/x-icon"; ".mp4" = "video/mp4"; ".json" = "application/json"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $Root at http://localhost:$Port/"

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $res = $ctx.Response
  $fs = $null
  try {
    $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
    if ($path -eq "" -or $path.EndsWith("/")) { $path += "index.html" }
    $file = Join-Path $Root $path
    if (-not (Test-Path $file -PathType Leaf)) { $res.StatusCode = 404; $res.Close(); continue }

    $ext = [IO.Path]::GetExtension($file).ToLower()
    $res.ContentType = $(if ($types.ContainsKey($ext)) { $types[$ext] } else { "application/octet-stream" })
    $res.Headers.Add("Accept-Ranges", "bytes")
    $res.Headers.Add("Cache-Control", "no-store")

    # Share read/write/delete so editors can save files while the server is running
    $fs = New-Object IO.FileStream($file, [IO.FileMode]::Open, [IO.FileAccess]::Read, [IO.FileShare]"ReadWrite, Delete")
    $len = $fs.Length; $start = 0; $end = $len - 1
    $range = $ctx.Request.Headers["Range"]
    if ($range -match "bytes=(\d*)-(\d*)") {
      if ($matches[1]) { $start = [int64]$matches[1] }
      if ($matches[2]) { $end = [int64]$matches[2] }
      $res.StatusCode = 206
      $res.Headers.Add("Content-Range", "bytes $start-$end/$len")
    }
    $count = $end - $start + 1
    $res.ContentLength64 = $count
    $fs.Seek($start, "Begin") | Out-Null
    $buf = New-Object byte[] 65536
    while ($count -gt 0) {
      $n = $fs.Read($buf, 0, [Math]::Min($buf.Length, $count))
      if ($n -le 0) { break }
      $res.OutputStream.Write($buf, 0, $n); $count -= $n
    }
  } catch { } finally {
    if ($fs) { $fs.Dispose() }
    try { $res.Close() } catch { }
  }
}
