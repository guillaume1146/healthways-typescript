# MediWyz — Deployment Guide (Oracle Cloud Free Tier)

Deploy MediWyz on an Oracle Cloud Infrastructure (OCI) **Always Free** Arm-based VM with Docker Compose, Nginx, and automated CI/CD.

---

## What You Get for Free

Oracle Cloud Always Free tier includes:

| Resource | Allocation |
|----------|-----------|
| **Ampere A1 Compute** | Up to 4 OCPUs + 24 GB RAM (split across max 4 VMs) |
| **Boot Volume** | 200 GB total block storage |
| **Object Storage** | 10 GB |
| **Outbound Data** | 10 TB/month |
| **Load Balancer** | 1 flexible (10 Mbps) |

**Recommended for MediWyz**: 1 VM with 2 OCPUs + 12 GB RAM — more than enough.

---

## Prerequisites

- An Oracle Cloud account ([Sign up free](https://www.oracle.com/cloud/free/))
- An SSH key pair on your local machine

Generate one if you don't have it:
```bash
ssh-keygen -t ed25519 -C "mediwyz-oci" -f ~/.ssh/oci_mediwyz
```

---

## 1. Create the VM Instance

### Via OCI Console

1. Log in to [cloud.oracle.com](https://cloud.oracle.com)
2. Go to **Compute > Instances > Create Instance**
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `mediwyz-vm` |
| **Image** | Ubuntu 22.04 (or 24.04) — **Arm-based (Ampere)** |
| **Shape** | VM.Standard.A1.Flex |
| **OCPUs** | 2 |
| **Memory** | 12 GB |
| **Boot volume** | 50 GB (default) |
| **SSH key** | Upload your `~/.ssh/oci_mediwyz.pub` |
| **VCN** | Create new VCN or use existing |

4. Click **Create**

### Via OCI CLI (optional)

```bash
# Install OCI CLI: https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm

oci compute instance launch \
  --compartment-id YOUR_COMPARTMENT_OCID \
  --availability-domain YOUR_AD \
  --shape VM.Standard.A1.Flex \
  --shape-config '{"ocpus": 2, "memoryInGBs": 12}' \
  --image-id YOUR_UBUNTU_ARM_IMAGE_OCID \
  --subnet-id YOUR_SUBNET_OCID \
  --ssh-authorized-keys-file ~/.ssh/oci_mediwyz.pub \
  --display-name mediwyz-vm
```

---

## 2. Open Firewall Ports (Security Lists)

OCI blocks all inbound traffic by default. You must open ports in **both** OCI Security Lists and the VM's iptables.

### A. OCI Security List (Console)

1. Go to **Networking > Virtual Cloud Networks > your VCN > Subnets > your Subnet > Security Lists**
2. Click the default security list
3. Add **Ingress Rules**:

| Source CIDR | Protocol | Dest Port | Description |
|-------------|----------|-----------|-------------|
| `0.0.0.0/0` | TCP | 80 | HTTP |
| `0.0.0.0/0` | TCP | 443 | HTTPS |
| `0.0.0.0/0` | TCP | 3000 | App (optional, remove after Nginx setup) |

### B. VM iptables (after SSH in)

```bash
# Ubuntu on OCI uses iptables rules that block ports by default
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT

# Save so they persist after reboot
sudo netfilter-persistent save
```

---

## 3. SSH into the VM

Find your VM's **Public IP** in the OCI Console (Compute > Instances > your instance).

```bash
ssh -i ~/.ssh/oci_mediwyz ubuntu@YOUR_VM_PUBLIC_IP
```

> **Note**: The default username for Ubuntu images on OCI is `ubuntu`.

---

## 4. Install Docker & Docker Compose

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

## 5. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/healthways-typescript.git
cd healthways-typescript
```

For private repos:
```bash
git clone https://YOUR_TOKEN@github.com/YOUR_USERNAME/healthways-typescript.git
```

---

## 6. Configure Environment Variables

```bash
cp .env.example .env
nano .env
```

Update for production:

```env
# Database (matches docker-compose.yml — change password!)
DATABASE_URL=postgresql://mediwyz:YOUR_STRONG_PASSWORD@db:5432/mediwyz

# App URLs — use your VM's public IP or domain
NEXT_PUBLIC_SOCKET_URL=http://YOUR_VM_IP:3000
NEXT_PUBLIC_APP_URL=http://YOUR_VM_IP:3000

# Generate a strong secret: openssl rand -base64 64
JWT_SECRET=YOUR_STRONG_JWT_SECRET

PORT=8080

# Super Admin
SUPER_ADMIN_EMAIL=admin@mediwyz.mu
SUPER_ADMIN_PASSWORD=ChangeThisPassword123!
SUPER_ADMIN_FIRST_NAME=Admin
SUPER_ADMIN_LAST_NAME=MediWyz

# Commission Rates (optional)
# PLATFORM_COMMISSION_RATE=5
# REGIONAL_COMMISSION_RATE=10

# AI Assistant (optional)
# GROQ_API_KEY=your-groq-api-key
```

Also update the DB password in `docker-compose.yml`:

```bash
nano docker-compose.yml
```

Change `POSTGRES_PASSWORD` and the `DATABASE_URL` to match your strong password.

---

## 7. Build & Start with Docker Compose

```bash
# Build and start in detached mode
docker compose up --build -d

# Check containers are running
docker compose ps

# View logs
docker compose logs -f app
```

> **Note**: First build on Arm may take 5-10 minutes. Subsequent builds are faster due to Docker layer caching.

---

## 8. Initialize the Database

```bash
# Push the Prisma schema to PostgreSQL
docker compose exec app npx prisma db push

# Seed demo data (optional — useful for testing)
docker compose exec app npx prisma db seed
```

---

## 9. Verify the Deployment

```bash
# Check app health locally
curl http://localhost:3000

# Check from outside (use your VM's public IP)
curl http://YOUR_VM_IP:3000
```

---

## 10. Set Up Nginx Reverse Proxy (Recommended)

### Install Nginx

```bash
sudo apt install nginx -y
```

### Configure

```bash
sudo nano /etc/nginx/sites-available/mediwyz
```

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # WebSocket support for Socket.IO
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
sudo ln -s /etc/nginx/sites-available/mediwyz /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

---

## 11. Enable HTTPS with Let's Encrypt (Production)

Requires a domain name pointing to your VM's public IP.

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is automatic. Test it:
sudo certbot renew --dry-run
```

After HTTPS is enabled, update your `.env`:
```env
NEXT_PUBLIC_SOCKET_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

Then restart:
```bash
docker compose down && docker compose up -d
```

---

## 12. Auto-Restart on Boot

Docker services have `restart: unless-stopped`. Ensure Docker starts on boot:

```bash
sudo systemctl enable docker
```

---

## 13. Database Backups

### Manual backup

```bash
docker compose exec db pg_dump -U mediwyz mediwyz > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Automated daily backups

```bash
sudo mkdir -p /opt/mediwyz-backups

# Create backup script
sudo tee /opt/mediwyz-backups/backup.sh << 'SCRIPT'
#!/bin/bash
BACKUP_DIR="/opt/mediwyz-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cd /home/ubuntu/healthways-typescript
docker compose exec -T db pg_dump -U mediwyz mediwyz > "$BACKUP_DIR/backup_$TIMESTAMP.sql"
# Keep only last 7 days
find "$BACKUP_DIR" -name "backup_*.sql" -mtime +7 -delete
SCRIPT

sudo chmod +x /opt/mediwyz-backups/backup.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/mediwyz-backups/backup.sh") | crontab -
```

### Backup to OCI Object Storage (optional)

```bash
# Install OCI CLI on the VM
bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"

# Configure with your tenancy details
oci setup config

# Create a bucket
oci os bucket create --name mediwyz-backups --compartment-id YOUR_COMPARTMENT_OCID

# Upload backup
oci os object put --bucket-name mediwyz-backups --file /opt/mediwyz-backups/backup_TIMESTAMP.sql
```

---

## 14. CI/CD — Auto Deploy on Push

A GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically lints, tests, builds, and deploys to your OCI VM on every push to `main`.

### Pipeline stages

```
Push to main → Lint & Type Check → Unit Tests → Docker Build → SSH Deploy to OCI VM
```

| Stage | Trigger | What it does |
|-------|---------|-------------|
| **Lint** | push & PR | Type check (`tsc`) + ESLint |
| **Test** | after Lint | Runs Vitest unit tests |
| **Build** | after Test | Builds Docker image to verify it compiles |
| **Deploy** | after Build (main only) | SSHs into OCI VM, pulls code, rebuilds containers |

### Setup — GitHub Secrets

Add these 3 secrets in your GitHub repo (**Settings > Secrets and variables > Actions > New repository secret**):

| Secret | Value | How to get it |
|--------|-------|---------------|
| `OCI_VM_IP` | Your VM's public IP | OCI Console > Compute > Instances > your VM |
| `OCI_VM_USER` | `ubuntu` | Default for Ubuntu images on OCI |
| `OCI_SSH_PRIVATE_KEY` | Your SSH private key | Contents of `~/.ssh/oci_mediwyz` |

### How to add the SSH private key secret

```bash
# Copy the private key content to clipboard
cat ~/.ssh/oci_mediwyz
```

Then paste the **entire content** (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`) as the value of `OCI_SSH_PRIVATE_KEY` in GitHub.

### Ensure the VM allows SSH from GitHub Actions

GitHub Actions runners use dynamic IPs. Your VM already allows SSH on port 22 (default OCI security list). If you've restricted SSH to specific IPs, you'll need to allow GitHub's IP ranges or use a self-hosted runner.

### Manual deploy (without CI/CD)

```bash
ssh -i ~/.ssh/oci_mediwyz ubuntu@YOUR_VM_IP
cd ~/healthways-typescript
git pull origin main
docker compose up --build -d
docker compose exec app npx prisma db push
```

---

## 15. Monitoring & Logs

```bash
# App logs
docker compose logs -f app

# Database logs
docker compose logs -f db

# Resource usage
docker stats

# System monitoring
htop

# Disk usage
df -h
```

---

## 16. Troubleshooting

| Issue | Solution |
|-------|---------|
| Container won't start | `docker compose logs app` — check for missing env vars |
| DB connection refused | Ensure `db` container is healthy: `docker compose ps` |
| Port not accessible from outside | Check **both** OCI Security List ingress rules AND VM iptables (Section 2) |
| WebSocket not connecting | Ensure Nginx has WebSocket proxy config (Section 10) |
| Out of disk space | `docker system prune -a` to clean unused images |
| SSH connection refused | Verify security list allows port 22, check `~/.ssh/oci_mediwyz` permissions (`chmod 600`) |
| Build slow on Arm | First build downloads Arm images — subsequent builds use cache |
| GitHub Actions deploy fails | Check `OCI_SSH_PRIVATE_KEY` secret has full key including headers |
| High memory usage | Add swap: `sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile` and add `/swapfile swap swap defaults 0 0` to `/etc/fstab` |

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
docker compose exec db psql -U mediwyz

# Prisma Studio (dev only)
docker compose exec app npx prisma studio

# SSH into VM
ssh -i ~/.ssh/oci_mediwyz ubuntu@YOUR_VM_IP

# Check public IP from VM
curl ifconfig.me
```
