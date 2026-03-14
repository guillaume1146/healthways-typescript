#!/bin/bash
# ─── Production VLM Document Verification Test ───────────────────────────────
# Tests the deployed /api/documents/verify endpoint to confirm
# the GROQ_API_KEY is working and VLM model is responding.
#
# Usage: bash scripts/test-production-vlm.sh https://your-domain.com
# ─────────────────────────────────────────────────────────────────────────────

set -e

BASE_URL="${1:-}"
if [ -z "$BASE_URL" ]; then
  echo "Usage: bash scripts/test-production-vlm.sh https://your-domain.com"
  exit 1
fi

# Remove trailing slash
BASE_URL="${BASE_URL%/}"

echo "═══════════════════════════════════════════════════════════"
echo "  Production VLM Test — $BASE_URL"
echo "═══════════════════════════════════════════════════════════"
echo ""

# ── Step 1: Health check ──────────────────────────────────────────────────
echo "1/4  Health check..."
HEALTH=$(curl -sk --max-time 10 "$BASE_URL/api/auth/me" 2>&1)
if echo "$HEALTH" | grep -q "Unauthorized"; then
  echo "     ✅ App is running (got Unauthorized as expected)"
else
  echo "     ❌ App not responding: $HEALTH"
  exit 1
fi

# ── Step 2: Login as seeded patient ───────────────────────────────────────
echo ""
echo "2/4  Logging in as patient1@mediwyz.com..."
LOGIN_RESPONSE=$(curl -sk --max-time 10 \
  -X POST "$BASE_URL/api/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"patient1@mediwyz.com","password":"Patient123!"}' \
  -c /tmp/mediwyz-cookies.txt \
  -D /tmp/mediwyz-headers.txt 2>&1)

if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
  USER_NAME=$(echo "$LOGIN_RESPONSE" | grep -o '"firstName":"[^"]*"' | head -1)
  echo "     ✅ Login successful — $USER_NAME"
else
  echo "     ❌ Login failed: $LOGIN_RESPONSE"
  echo "     Trying doctor1@mediwyz.com..."
  LOGIN_RESPONSE=$(curl -sk --max-time 10 \
    -X POST "$BASE_URL/api/auth/login" \
    -H 'Content-Type: application/json' \
    -d '{"email":"doctor1@mediwyz.com","password":"Doctor123!"}' \
    -c /tmp/mediwyz-cookies.txt \
    -D /tmp/mediwyz-headers.txt 2>&1)
  if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
    echo "     ✅ Login as doctor successful"
  else
    echo "     ❌ Both logins failed. Check seed data."
    exit 1
  fi
fi

# ── Step 3: Create a test image with text ─────────────────────────────────
echo ""
echo "3/4  Creating test image..."

# Use the project icon as test file (128x128 PNG)
TEST_IMAGE="public/icons/icon-128x128.png"
if [ ! -f "$TEST_IMAGE" ]; then
  echo "     Using a generated test file..."
  # Create a minimal valid PNG (1x1 red pixel)
  printf '\x89PNG\r\n\x1a\n' > /tmp/test-doc.png
  TEST_IMAGE="/tmp/test-doc.png"
else
  echo "     Using $TEST_IMAGE"
fi

# ── Step 4: Test document verification endpoint ──────────────────────────
echo ""
echo "4/4  Testing /api/documents/verify (VLM)..."
echo ""

VERIFY_RESPONSE=$(curl -sk --max-time 30 \
  -X POST "$BASE_URL/api/documents/verify" \
  -b /tmp/mediwyz-cookies.txt \
  -F "file=@$TEST_IMAGE;type=image/png" \
  -F "fullName=Marie Claire Dupont" \
  -F "documentType=National ID" 2>&1)

echo "     Response: $VERIFY_RESPONSE"
echo ""

# Parse the response
if echo "$VERIFY_RESPONSE" | grep -q '"success":true'; then
  METHOD=$(echo "$VERIFY_RESPONSE" | grep -o '"method":"[^"]*"' | head -1)
  CONFIDENCE=$(echo "$VERIFY_RESPONSE" | grep -o '"confidence":[0-9]*' | head -1)
  VERIFIED=$(echo "$VERIFY_RESPONSE" | grep -o '"verified":[a-z]*' | head -1)

  echo "═══════════════════════════════════════════════════════════"
  if echo "$METHOD" | grep -q "vlm"; then
    echo "  ✅ VLM IS WORKING IN PRODUCTION!"
    echo "  $METHOD | $CONFIDENCE | $VERIFIED"
    echo ""
    echo "  The Groq API key is properly configured and the"
    echo "  Llama 4 Scout VLM model is analyzing documents."
  elif echo "$METHOD" | grep -q "fallback"; then
    echo "  ⚠️  VLM FALLBACK — GROQ_API_KEY may be missing!"
    echo "  $METHOD | $CONFIDENCE | $VERIFIED"
    echo ""
    echo "  The endpoint responded but fell back to manual review."
    echo "  Check that GROQ_API_KEY is in the .env on the VM."
  else
    echo "  ℹ️  Response received: $METHOD | $CONFIDENCE"
  fi
  echo "═══════════════════════════════════════════════════════════"
elif echo "$VERIFY_RESPONSE" | grep -q "Unauthorized"; then
  echo "  ❌ Authentication failed — cookies not sent properly"
elif echo "$VERIFY_RESPONSE" | grep -q "Verification failed"; then
  echo "  ❌ Server error — check container logs: docker compose logs app"
else
  echo "  ❌ Unexpected response"
fi

echo ""

# ── Cleanup ──────────────────────────────────────────────────────────────
rm -f /tmp/mediwyz-cookies.txt /tmp/mediwyz-headers.txt /tmp/test-doc.png

echo "Done."
