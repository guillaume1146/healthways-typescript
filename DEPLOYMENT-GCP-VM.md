# Healthwyz — Deployment Guide (Google Cloud VM)

This guide walks through deploying Healthwyz on a Google Cloud Compute Engine VM using Docker Compose.

---

## Prerequisites

- A Google Cloud Platform (GCP) account with billing enabled
- `gcloud` CLI installed locally ([Install Guide](https://cloud.google.com/sdk/docs/install))
- A domain name (optional, for HTTPS with Nginx)

---

## 1. Create a VM Instance

### Via gcloud CLI

```bash
gcloud compute instances create healthwyz-vm \
  --project=YOUR_PROJECT_ID \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=30GB \
  --tags=http-server,https-server
```

### Recommended specs

| Workload    | Machine Type | vCPUs | RAM   |
|-------------|-------------|-------|-------|
| Dev/Testing | e2-small    | 2     | 2 GB  |
| Production  | e2-medium   | 2     | 4 GB  |
| High Traffic| e2-standard-4| 4    | 16 GB |

### Open firewall ports

```bash
# HTTP
gcloud compute firewall-rules create allow-http \
  --allow tcp:80 --target-tags=http-server

# HTTPS
gcloud compute firewall-rules create allow-https \
  --allow tcp:443 --target-tags=https-server

# App port (if not using Nginx reverse proxy)
gcloud compute firewall-rules create allow-app \
  --allow tcp:3000 --target-tags=http-server
```

---

## 2. SSH into the VM

```bash
gcloud compute ssh healthwyz-vm --zone=us-central1-a
```

---

## 3. Install Docker & Docker Compose

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sudo sh

# Add your user to the docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
docker compose version
```

---

## 4. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/healthways-typescript.git
cd healthways-typescript
```

If using a private repo, set up an SSH key or use a personal access token:
```bash
git clone https://YOUR_TOKEN@github.com/YOUR_USERNAME/healthways-typescript.git
```

---

## 5. Configure Environment Variables

```bash
cp .env.example .env
nano .env
```

Update the following values for production:

```env
# Database (matches docker-compose.yml defaults — change password for production)
DATABASE_URL=postgresql://healthwyz:YOUR_STRONG_PASSWORD@db:5432/healthwyz

# App URLs — replace with your VM's external IP or domain
NEXT_PUBLIC_SOCKET_URL=http://YOUR_VM_IP:3000
NEXT_PUBLIC_APP_URL=http://YOUR_VM_IP:3000

# Generate a strong secret: openssl rand -base64 64
JWT_SECRET=YOUR_STRONG_JWT_SECRET

PORT=8080

# Super Admin
SUPER_ADMIN_EMAIL=admin@healthwyz.mu
SUPER_ADMIN_PASSWORD=ChangeThisPassword123!
SUPER_ADMIN_FIRST_NAME=Admin
SUPER_ADMIN_LAST_NAME=Healthwyz

# Commission Rates (optional)
# PLATFORM_COMMISSION_RATE=5
# REGIONAL_COMMISSION_RATE=10

# AI Assistant (optional)
# GROQ_API_KEY=your-groq-api-key
```

Also update the DB password in `docker-compose.yml` to match:

```bash
nano docker-compose.yml
```

Change `POSTGRES_PASSWORD` and the `DATABASE_URL` to use your strong password.

---

## 6. Build & Start with Docker Compose

```bash
# Build and start in detached mode
docker compose up --build -d

# Check containers are running
docker compose ps

# View logs
docker compose logs -f app
```

---

## 7. Initialize the Database

```bash
# Push the Prisma schema to PostgreSQL
docker compose exec app npx prisma db push

# Seed demo data (optional — useful for testing)
docker compose exec app npx prisma db seed
```

---

## 8. Verify the Deployment

```bash
# Check app health
curl http://localhost:3000

# Check from outside (use your VM's external IP)
curl http://YOUR_VM_IP:3000
```

Find your VM's external IP:
```bash
gcloud compute instances describe healthwyz-vm \
  --zone=us-central1-a \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

---

## 9. Set Up Nginx Reverse Proxy (Recommended)

### Install Nginx

```bash
sudo apt install nginx -y
```

### Configure

```bash
sudo nano /etc/nginx/sites-available/healthwyz
```

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        client_max_body_size 10M;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/healthwyz /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

---

## 10. Enable HTTPS with Let's Encrypt (Production)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically. Test it:
sudo certbot renew --dry-run
```

After HTTPS is enabled, update your `.env`:
```env
NEXT_PUBLIC_SOCKET_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

Then restart the app:
```bash
docker compose down && docker compose up -d
```

---

## 11. Set Up Auto-Restart on Boot

Docker Compose services already have `restart: unless-stopped`. Ensure Docker starts on boot:

```bash
sudo systemctl enable docker
```

---

## 12. Database Backups

### Manual backup

```bash
docker compose exec db pg_dump -U healthwyz healthwyz > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Automated daily backups with cron

```bash
sudo mkdir -p /opt/healthwyz-backups

# Create backup script
sudo tee /opt/healthwyz-backups/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/healthwyz-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cd /home/$USER/healthways-typescript
docker compose exec -T db pg_dump -U healthwyz healthwyz > "$BACKUP_DIR/backup_$TIMESTAMP.sql"
# Keep only last 7 days
find "$BACKUP_DIR" -name "backup_*.sql" -mtime +7 -delete
EOF

sudo chmod +x /opt/healthwyz-backups/backup.sh

# Add to crontab (runs daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/healthwyz-backups/backup.sh") | crontab -
```

### Backup to Google Cloud Storage (optional)

```bash
# Install gsutil (comes with gcloud SDK on the VM)
gsutil mb gs://healthwyz-backups-YOUR_PROJECT

# Add to backup script:
gsutil cp "$BACKUP_DIR/backup_$TIMESTAMP.sql" gs://healthwyz-backups-YOUR_PROJECT/
```

---

## 13. Monitoring & Logs

```bash
# View app logs
docker compose logs -f app

# View database logs
docker compose logs -f db

# Check resource usage
docker stats

# System monitoring
htop
```

### Google Cloud Monitoring (optional)

Install the Ops Agent for VM metrics in the GCP Console:
```bash
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install
```

---

## 14. CI/CD — Auto Deploy on Push

A GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically lints, tests, builds, and deploys to your GCP VM on every push to `main`.

### Pipeline stages

| Stage | Trigger | What it does |
|-------|---------|-------------|
| **Lint** | push & PR | Type check (`tsc --noEmit`) + ESLint |
| **Test** | after Lint | Runs Vitest unit tests |
| **Build** | after Test | Builds Docker image to verify it compiles |
| **Deploy** | after Build (main only) | SSHs into VM, pulls code, rebuilds containers |

### Setup — GitHub Secrets

You need to add 2 secrets in your GitHub repo (**Settings > Secrets and variables > Actions**):

| Secret | Value |
|--------|-------|
| `GCP_PROJECT_ID` | Your GCP project ID (e.g. `healthwyz-prod-123`) |
| `GCP_SA_KEY` | JSON key of a GCP service account (see below) |

### Create the GCP Service Account

```bash
# Create service account
gcloud iam service-accounts create github-deploy \
  --display-name="GitHub Actions Deploy"

# Grant Compute OS Login for SSH
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/compute.osLogin"

# Grant Compute Instance Admin (for gcloud compute ssh)
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/compute.instanceAdmin.v1"

# Generate JSON key
gcloud iam service-accounts keys create sa-key.json \
  --iam-account=github-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com

# Copy the content of sa-key.json → paste as GCP_SA_KEY secret in GitHub
cat sa-key.json
```

### Enable OS Login on the VM

```bash
gcloud compute instances add-metadata healthwyz-vm \
  --zone=us-central1-a \
  --metadata enable-oslogin=TRUE
```

### Manual update (without CI/CD)

```bash
cd ~/healthways-typescript
git pull origin main
docker compose up --build -d
docker compose exec app npx prisma db push
```

---

## 15. Troubleshooting

| Issue | Solution |
|-------|---------|
| Container won't start | `docker compose logs app` — check for missing env vars |
| Database connection refused | Ensure `db` container is healthy: `docker compose ps` |
| Port 3000 not accessible | Check firewall rules: `gcloud compute firewall-rules list` |
| WebSocket not connecting | Ensure Nginx has WebSocket proxy config (Section 9) |
| Out of disk space | `docker system prune -a` to clean unused images |
| High memory usage | Consider upgrading VM or adding swap: `sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile` |

---

## Quick Reference

```bash
# Start
docker compose up -d

# Stop
docker compose down

# Rebuild after code changes
docker compose up --build -d

# View logs
docker compose logs -f

# Database shell
docker compose exec db psql -U healthwyz

# Prisma Studio (dev only — exposes port 5555)
docker compose exec app npx prisma studio

# Check external IP
curl ifconfig.me
```
