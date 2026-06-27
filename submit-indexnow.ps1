<#
.SYNOPSIS
    Submit URLs to IndexNow (Bing, Yandex, etc.) so search engines re-crawl them fast.

.DESCRIPTION
    IndexNow lets you ping participating search engines the moment a page changes,
    instead of waiting for them to re-crawl on their own schedule.

    With no arguments, this script reads sitemap.xml and submits every URL in it.
    Pass one or more URLs to submit only those (use this after editing specific pages).

.EXAMPLE
    .\submit-indexnow.ps1
    Submits every URL in sitemap.xml.

.EXAMPLE
    .\submit-indexnow.ps1 https://tonycarloslaw.com/ https://tonycarloslaw.com/practice-areas/dui
    Submits only the two given URLs.
#>

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Urls
)

$ErrorActionPreference = 'Stop'

# --- Config ---------------------------------------------------------------
$Host_       = 'tonycarloslaw.com'
$Key         = 'b4a1e25e7492e6768ed5aae75b673fb8'
$KeyLocation = "https://$Host_/$Key.txt"
$Endpoint    = 'https://api.indexnow.org/indexnow'
# -------------------------------------------------------------------------

# If no URLs were passed, pull them all from sitemap.xml.
if (-not $Urls -or $Urls.Count -eq 0) {
    $sitemapPath = Join-Path $PSScriptRoot 'sitemap.xml'
    if (-not (Test-Path $sitemapPath)) {
        throw "No URLs given and sitemap.xml not found at $sitemapPath"
    }
    [xml]$sitemap = Get-Content $sitemapPath
    $Urls = $sitemap.urlset.url.loc
    Write-Host "Read $($Urls.Count) URLs from sitemap.xml"
}

$body = @{
    host        = $Host_
    key         = $Key
    keyLocation = $KeyLocation
    urlList     = $Urls
} | ConvertTo-Json

Write-Host "Submitting $($Urls.Count) URL(s) to IndexNow..."
$Urls | ForEach-Object { Write-Host "  $_" }

try {
    $resp = Invoke-WebRequest -Uri $Endpoint -Method Post -Body $body `
        -ContentType 'application/json; charset=utf-8' -UseBasicParsing
    Write-Host ""
    Write-Host "HTTP $($resp.StatusCode) $($resp.StatusDescription)" -ForegroundColor Green
    Write-Host "200 = accepted. (202 = accepted, key validation pending.)"
}
catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Host ""
    Write-Host "Submission failed: HTTP $code" -ForegroundColor Red
    Write-Host "  400 = bad request   403 = key not found/invalid   422 = URL doesn't match host"
    throw
}
