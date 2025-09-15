#!/bin/bash

# ====================================================
# Google Cloud Run Deployment Script for Healthwyz
# ====================================================

# Configuration Variables
PROJECT_ID="healthtechmvp"
REGION="us-central1"  # Change if needed
SERVICE_NAME="healthwyz-app"
IMAGE_NAME="healthwyz"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting deployment to Google Cloud Run${NC}"
echo "----------------------------------------"

# Step 1: Authenticate with Google Cloud
echo -e "${YELLOW}Step 1: Authenticating with Google Cloud...${NC}"
gcloud auth login --email=atr.guillaume@gmail.com

# Step 2: Set the project
echo -e "${YELLOW}Step 2: Setting project to ${PROJECT_ID}...${NC}"
gcloud config set project ${PROJECT_ID}

# Step 3: Configure Docker for Google Container Registry
echo -e "${YELLOW}Step 3: Configuring Docker for GCR...${NC}"
gcloud auth configure-docker

# Step 4: Enable required APIs
echo -e "${YELLOW}Step 4: Enabling required Google Cloud APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Step 5: Create Artifact Registry repository (if not exists)
echo -e "${YELLOW}Step 5: Creating Artifact Registry repository...${NC}"
gcloud artifacts repositories create ${IMAGE_NAME} \
    --repository-format=docker \
    --location=${REGION} \
    --description="Docker repository for Healthwyz app" \
    2>/dev/null || echo "Repository already exists"

# Step 6: Build Docker image locally (optional - for testing)
echo -e "${YELLOW}Step 6: Building Docker image locally for testing...${NC}"
docker build -t ${IMAGE_NAME}:latest .

# Step 7: Tag the image for Google Container Registry
echo -e "${YELLOW}Step 7: Tagging image for GCR...${NC}"
docker tag ${IMAGE_NAME}:latest gcr.io/${PROJECT_ID}/${IMAGE_NAME}:latest

# Alternative: Tag for Artifact Registry (recommended)
docker tag ${IMAGE_NAME}:latest ${REGION}-docker.pkg.dev/${PROJECT_ID}/${IMAGE_NAME}/${IMAGE_NAME}:latest

# Step 8: Push image to Google Container Registry
echo -e "${YELLOW}Step 8: Pushing image to GCR...${NC}"
docker push gcr.io/${PROJECT_ID}/${IMAGE_NAME}:latest

# Alternative: Push to Artifact Registry (recommended)
# docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${IMAGE_NAME}/${IMAGE_NAME}:latest

# Step 9: Deploy to Cloud Run
echo -e "${YELLOW}Step 9: Deploying to Cloud Run...${NC}"
gcloud run deploy ${SERVICE_NAME} \
    --image gcr.io/${PROJECT_ID}/${IMAGE_NAME}:latest \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --port 8080 \
    --memory 1Gi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 100 \
    --set-env-vars="NODE_ENV=production" \
    --set-env-vars="APP_NAME=Healthwyz" \
    --set-env-vars="APP_TAGLINE=Your trusted healthcare companion" \
    --timeout 300

# Step 10: Get the service URL
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo "----------------------------------------"
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)')
echo -e "${GREEN}Your app is live at: ${SERVICE_URL}${NC}"

# Optional: Set up custom domain
echo -e "${YELLOW}To set up a custom domain, run:${NC}"
echo "gcloud beta run domain-mappings create --service ${SERVICE_NAME} --domain your-domain.com --region ${REGION}"