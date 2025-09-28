<#
  toolbox.ps1 — Reusable commands for Healthwyz project (Windows/PowerShell)
  HOW TO RUN:
    1) Open PowerShell in the project root
    2) If scripts are blocked: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    3) Execute: .\scripts\toolbox.ps1
    4) Choose from the menu

  NOTES:
    - Edit the variables in the "CONFIG" section to match your project.
    - Each function has comments explaining WHEN to use it.
#>

# ---------- CONFIG (edit to your environment) ----------
$ServiceName      = "healthwyz-app"
$Region           = "us-central1"
$ServiceAccount   = "818061759099-compute@developer.gserviceaccount.com"
$CloudSQLInstance = "healthtechmvp:us-central1:healthwyz-db"
$PublicURL        = "https://healthwyz-app-pylrovz4aq-uc.a.run.app"

# Keep env vars readable with a here-string (double quotes to allow apostrophes)
$EnvVars = @"
DATABASE_URL=postgresql://healthwyz_user:ETU001146@localhost/healthwyz_production?host=/cloudsql/healthtechmvp:us-central1:healthwyz-db,APP_NAME=Healthwyz,APP_TAGLINE=Your trusted healthcare companion in Mauritius,HERO_TITLE=Your Health Our Priority,PLATFORM_DESC=Mauritius's Leading Healthcare Platform,NODE_ENV=production,NEXT_PUBLIC_SOCKET_URL=$PublicURL,NEXT_PUBLIC_APP_URL=$PublicURL
"@.Trim()

# ---------- FUNCTIONS ----------

function Deploy-CloudRun {
<#
  WHEN TO USE:
    - After code changes that must be deployed to Cloud Run
    - After changing env vars, memory, or Cloud SQL attachment
    - After first-time setup to create/update the service

  WHAT IT DOES:
    - Builds from the current directory (--source .)
    - Deploys to Cloud Run (fully managed)
    - Exposes service publicly (--allow-unauthenticated)
    - Attaches Cloud SQL instance
    - Sets all required environment variables
#>
  Write-Host "Deploying $ServiceName to Cloud Run in $Region..." -ForegroundColor Cyan
  gcloud run deploy `
    $ServiceName `
    --source . `
    --region $Region `
    --allow-unauthenticated `
    --timeout 3600s `
    --memory 1Gi `
    --service-account $ServiceAccount `
    --add-cloudsql-instances $CloudSQLInstance `
    --set-env-vars="$EnvVars"

  if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deploy complete. Service URL should be printed above." -ForegroundColor Green
  } else {
    Write-Host "❌ Deploy failed." -ForegroundColor Red
  }
}

function Prisma-Generate {
<#
  WHEN TO USE:
    - After editing schema.prisma (models, enums, generators)
    - Before running code that relies on updated Prisma client
#>
  Write-Host "Running: npx prisma generate" -ForegroundColor Cyan
  npx prisma generate
}

function Prisma-DbPush {
<#
  WHEN TO USE:
    - During development to push schema changes to the database WITHOUT migrations
    - Good for quick iteration, not recommended for strict production change control
#>
  Write-Host "Running: npx prisma db push" -ForegroundColor Cyan
  npx prisma db push
}

function Prisma-DbSeed {
<#
  WHEN TO USE:
    - To insert initial/reference data (roles, demo users, sample content)
    - After a fresh database or after schema changes that require base data
#>
  Write-Host "Running: npx prisma db seed" -ForegroundColor Cyan
  npx prisma db seed
}

function Start-CloudSQLProxy {
<#
  WHEN TO USE:
    - For local development if your app connects to Cloud SQL via the proxy on localhost:5432
    - Run this in a separate terminal before starting your app locally
#>
  $exe = Join-Path (Get-Location) "cloud-sql-proxy.exe"
  if (-not (Test-Path $exe)) {
    Write-Host "cloud-sql-proxy.exe not found in current folder. Put it in the project root or update this function." -ForegroundColor Yellow
    return
  }
  & $exe --port 5432 $CloudSQLInstance
}

# ---------- SIMPLE MENU ----------
Write-Host ""
Write-Host "================ Project Toolbox ================" -ForegroundColor Magenta
Write-Host "1) Deploy Cloud Run"
Write-Host "2) Prisma Generate"
Write-Host "3) Prisma DB Push"
Write-Host "4) Prisma DB Seed"
Write-Host "5) Start Cloud SQL Proxy (local dev)"
Write-Host "Q) Quit"
Write-Host "=================================================="
$choice = Read-Host "Choose an option"

switch ($choice) {
  "1" { Deploy-CloudRun }
  "2" { Prisma-Generate }
  "3" { Prisma-DbPush }
  "4" { Prisma-DbSeed }
  "5" { Start-CloudSQLProxy }
  "Q" { return }
  "q" { return }
  default { Write-Host "Unknown option." -ForegroundColor Yellow }
}
