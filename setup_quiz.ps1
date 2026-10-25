# setup_quiz.ps1
# ------------------------------------------------------------
# This script will:
#   1. Ensure Docker Desktop is installed.
#   2. Build the Docker image (via docker compose).
#   3. Run the container on port 8080.
#   4. Open the quiz in the default web browser.
# ------------------------------------------------------------

function Ensure-Docker {
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        Write-Host "Docker is already installed."
        return
    }
    Write-Host "Docker command not found. Installing Docker Desktop via winget..."
    # winget may not be present on very old Windows; the user can install it separately.
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        winget install -e --id Docker.DockerDesktop --source winget
        Write-Host "Docker Desktop installation started. Please follow any UI prompts and then restart this script."
    } else {
        Write-Error "winget not available. Please manually install Docker Desktop from https://www.docker.com/products/docker-desktop"
    }
    exit 1
}

# Ensure Docker is available
Ensure-Docker

# Use docker compose (included with Docker Desktop) to build & run
Write-Host "Building and starting the quiz container..."
# The compose file is in the same directory as this script
docker compose -f "${PSScriptRoot}\docker-compose.yml" up -d

if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker compose failed. Check Docker Desktop is running and try again."
    exit $LASTEXITCODE
}

# Give the container a moment to start
Start-Sleep -Seconds 5

# Open the quiz in the default browser
$url = "http://localhost:8080/"
Write-Host "Opening $url in your default browser..."
Start-Process $url

Write-Host "Setup complete. The quiz should be visible at $url"

