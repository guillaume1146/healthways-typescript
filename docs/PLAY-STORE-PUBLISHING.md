# Publishing Healthwyz as an Android App on Google Play Store

## Overview

Healthwyz is a PWA (Progressive Web App) that can be wrapped as a native Android APK and published to the Google Play Store. This document covers the three main approaches, requirements, and step-by-step instructions.

---

## Prerequisites (Already Done)

- [x] Valid `manifest.json` with icons, name, start_url, display: standalone
- [x] HTTPS enabled (https://h-wyz.com)
- [x] Service worker registered (`/sw.js`)
- [x] Responsive design with viewport meta tag
- [x] Capacitor configured (`capacitor.config.ts`)

## Prerequisites (Still Needed)

- [ ] Google Play Developer account ($25 one-time fee) — [Register here](https://play.google.com/console/signup)
- [ ] App signing key (generated during APK build)
- [ ] Digital Asset Links file (`.well-known/assetlinks.json`) — for TWA approach
- [ ] Privacy policy URL (required by Play Store)
- [ ] App screenshots (phone + tablet) for Play Store listing
- [ ] Feature graphic (1024x500px) for Play Store listing

---

## Approach 1: TWA (Trusted Web Activity) — Recommended for MVP

TWA is Google's official way to wrap a PWA into an Android app. It runs your website inside a full-screen Chrome custom tab without any browser UI.

### Pros
- Tiny APK size (~2MB)
- Auto-updates when the website is updated — no need to republish the app
- Full access to PWA features (service worker, web push notifications)
- Passes Play Store review easily
- No need to maintain a separate codebase

### Cons
- Requires Chrome 72+ on the device (99%+ of Android phones have it)
- Falls back to a Chrome Custom Tab with URL bar if Digital Asset Links aren't configured
- Limited access to native-only APIs (e.g., Bluetooth, NFC)

### Option A: PWABuilder (Easiest — ~5 minutes)

1. Go to [https://www.pwabuilder.com/](https://www.pwabuilder.com/)
2. Enter `https://h-wyz.com`
3. PWABuilder will audit your PWA and show a score
4. Click **"Package for stores"** → select **Android (Google Play)**
5. Fill in:
   - **Package ID**: `mu.healthwyz.app`
   - **App name**: `Healthwyz`
   - **App version**: `1.0.0`
   - **Host**: `h-wyz.com` (or final production domain)
   - **Start URL**: `/`
   - **Theme color**: `#2563eb`
   - **Splash screen color**: `#ffffff`
6. Download the generated **AAB** (Android App Bundle) + signing key
7. **Save the signing key securely** — you need it for updates and Digital Asset Links
8. Upload the AAB to Google Play Console

> **Important**: PWABuilder generates both a debug APK and a signed AAB. Use the AAB for Play Store submission.

**PWABuilder docs**: [https://docs.pwabuilder.com/#/builder/android](https://docs.pwabuilder.com/#/builder/android)

### Option B: Bubblewrap CLI (More Control)

Bubblewrap is Google Chrome Labs' official CLI tool for generating TWA Android projects.

**Requirements**: Node.js 14+, Java JDK 8+, Android SDK

```bash
# Install Bubblewrap globally
npm install -g @nicedayfor/nicedayfor.github.io

# Initialize a new TWA project from your manifest
bubblewrap init --manifest=https://h-wyz.com/manifest.json

# Follow the interactive prompts:
#   - Package name: mu.healthwyz.app
#   - App name: Healthwyz
#   - Launcher name: Healthwyz
#   - Theme color: #2563eb
#   - Background color: #ffffff
#   - Start URL: /
#   - Signing key: (generate new or use existing)

# Build the APK/AAB
bubblewrap build

# Output: app-release-bundle.aab (upload this to Play Console)
# Output: app-release-signed.apk (for testing on device)
```

**Bubblewrap GitHub**: [https://github.com/nicedayfor/nicedayfor.github.io](https://github.com/nicedayfor/nicedayfor.github.io)
**Guide**: [https://nicedayfor.github.io/nicedayfor.github.io/nicedayfor.github.io/nicedayfor.github.io](https://nicedayfor.github.io/nicedayfor.github.io/nicedayfor.github.io/nicedayfor.github.io)

### Setting Up Digital Asset Links (Required for TWA)

Without Digital Asset Links, the TWA will show a browser URL bar at the top, ruining the native app experience.

**Step 1**: Get your app's SHA-256 fingerprint

```bash
# From your local keystore
keytool -list -v -keystore your-keystore.jks -alias your-alias

# Or from Play Console:
# Setup → App signing → SHA-256 certificate fingerprint
# (Google re-signs your app, so use BOTH your upload key AND the Play Store key)
```

**Step 2**: Create `public/.well-known/assetlinks.json`

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "mu.healthwyz.app",
    "sha256_cert_fingerprints": [
      "YOUR_SHA256_FINGERPRINT_HERE"
    ]
  }
}]
```

> If Google Play re-signs your app (App Signing by Google Play), add BOTH fingerprints:
> your upload key fingerprint AND the Play Store signing key fingerprint.

**Step 3**: Ensure Next.js serves the file. The `public/.well-known/` directory should be served automatically. Verify at:
```
https://h-wyz.com/.well-known/assetlinks.json
```

The response must have `Content-Type: application/json` and return HTTP 200.

**Validation tool**: [https://developers.google.com/digital-asset-links/tools/generator](https://developers.google.com/digital-asset-links/tools/generator)

---

## Approach 2: Capacitor (Native Shell)

The project already has Capacitor configured. This wraps the web app in a native Android WebView with full access to native device APIs.

### Pros
- Full native API access (camera, GPS, biometrics, push notifications, file system)
- Better offline support with native caching
- Can use any Capacitor/Cordova plugin
- No Chrome dependency — uses the system WebView
- More control over the app lifecycle

### Cons
- Larger APK (~15-30MB)
- Must rebuild and republish for every website update
- Requires Android Studio for building
- More complex CI/CD pipeline

### Steps

```bash
# 1. Install Capacitor CLI and Android platform
npm install @nicedayfor/nicedayfor.github.io @nicedayfor/nicedayfor.github.io

# 2. Initialize (already done in this project)
npx cap init Healthwyz mu.healthwyz.app --web-dir out

# 3. Build the Next.js app
npm run build

# 4. Export as static site (if using static export)
# Add to next.config.js: output: 'export'
# Then: npm run build

# 5. Copy web assets to Android project
npx cap copy android
npx cap sync android

# 6. Open in Android Studio
npx cap open android

# 7. In Android Studio:
#    Build → Generate Signed Bundle/APK
#    Choose AAB for Play Store
#    Sign with your keystore
```

### Useful Capacitor Plugins for Healthwyz

| Plugin | Purpose | Install |
|--------|---------|---------|
| `@capacitor/push-notifications` | Native push for appointments, messages | `npm install @nicedayfor/nicedayfor.github.io` |
| `@capacitor/camera` | Upload profile photos, medical docs | `npm install @nicedayfor/nicedayfor.github.io` |
| `@capacitor/haptics` | Vibration feedback on actions | `npm install @nicedayfor/nicedayfor.github.io` |
| `@capacitor/local-notifications` | Pill reminders, appointment alerts | `npm install @nicedayfor/nicedayfor.github.io` |
| `@capacitor/biometric` | Fingerprint/face login | `npm install @nicedayfor/nicedayfor.github.io` |
| `@capacitor/geolocation` | Find nearby providers | `npm install @nicedayfor/nicedayfor.github.io` |
| `@capacitor/share` | Share prescriptions, reports | `npm install @nicedayfor/nicedayfor.github.io` |

**Capacitor docs**: [https://capacitorjs.com/docs](https://capacitorjs.com/docs)
**Android guide**: [https://capacitorjs.com/docs/android](https://capacitorjs.com/docs/android)

---

## Approach 3: PWABuilder Starter (Hybrid)

PWABuilder also offers a starter project that combines TWA with Capacitor-like plugin support, giving you a middle ground.

**Docs**: [https://docs.pwabuilder.com/](https://docs.pwabuilder.com/)

---

## Google Play Store Submission Checklist

### 1. Play Console Setup
- Create app in [Google Play Console](https://play.google.com/console/)
- App details:
  - **App name**: Healthwyz
  - **Default language**: English (United States)
  - **App type**: Application
  - **Category**: Medical
  - **Free / Paid**: Free (with in-app purchases if applicable)
  - **Target audience**: 18+ (medical/health data)

### 2. Store Listing Assets

| Asset | Specification |
|-------|---------------|
| **App icon** | 512x512px PNG, 32-bit, no transparency. Use `public/icons/icon-512x512.png` |
| **Feature graphic** | 1024x500px PNG or JPG |
| **Phone screenshots** | Min 2, max 8. Between 320px-3840px on each side. 16:9 or 9:16 ratio |
| **Tablet screenshots** | Min 1 for tablet support. 7" and 10" recommended |
| **Short description** | Max 80 chars: `Connect with doctors & nurses in Mauritius. Book video consultations.` |
| **Full description** | Max 4000 chars: detailed feature list, benefits, supported user types |

### 3. Content Rating
- Complete the IARC content rating questionnaire
- Healthcare apps typically receive an **"Everyone"** rating
- Declare if the app contains user-generated content or health/medical information
- **IARC portal**: [https://www.globalratings.com/](https://www.globalratings.com/)

### 4. Privacy Policy (Required)
- **Mandatory** for apps accessing personal or health data
- Host at: `https://h-wyz.com/privacy-policy`
- Must cover:
  - What data is collected (name, email, phone, health records, prescriptions)
  - How data is stored (encrypted PostgreSQL, HTTPS in transit)
  - Data sharing practices (not shared with third parties)
  - User rights (access, deletion, export)
  - GDPR compliance (if serving EU users)
  - POPIA compliance (South Africa / Mauritius)
  - Data Protection Act 2017 (Mauritius)

### 5. Data Safety Section
Required declaration in Play Console:

| Data Type | Collected | Shared | Purpose |
|-----------|-----------|--------|---------|
| Name, email, phone | Yes | No | Account management |
| Health info (records, vitals, prescriptions) | Yes | No | Core app functionality |
| Location | Optional | No | Find nearby providers |
| Photos/videos | Optional | No | Profile pictures, documents |
| Financial info (payment methods) | Yes | No | Billing |
| App activity (logs, interactions) | Yes | No | Analytics, debugging |

All data:
- Encrypted in transit (HTTPS/TLS)
- Encrypted at rest (PostgreSQL with encryption)
- Users can request deletion

### 6. App Review Timeline
- **First submission**: 1-7 days (medical/health apps may take longer)
- **Updates**: Usually 1-3 days
- **Common rejection reasons**:
  - Missing privacy policy
  - App crashes or doesn't load
  - Misleading store listing
  - Health claims without disclaimers

---

## Recommended Roadmap

| Phase | Approach | Timeline | Cost |
|-------|----------|----------|------|
| **Phase 1: MVP Launch** | TWA via PWABuilder | 1-2 days | $25 (Play Store) |
| **Phase 2: Enhanced** | Add Digital Asset Links + push notifications | 1 day | Free |
| **Phase 3: Native Features** | Migrate to Capacitor | 1-2 weeks | Free |
| **Phase 4: iOS** | PWABuilder for iOS or Capacitor | 1-2 weeks | $99/year (Apple Developer) |

### Immediate Next Steps

1. Register a [Google Play Developer account](https://play.google.com/console/signup) ($25 one-time)
2. Go to [PWABuilder](https://www.pwabuilder.com/) → enter `https://h-wyz.com` → generate AAB
3. Add `public/.well-known/assetlinks.json` with your signing key fingerprint
4. Create a privacy policy page at `/privacy-policy`
5. Take screenshots of the app on mobile for the store listing
6. Submit to Google Play Console

---

## Useful Links & Resources

| Resource | URL |
|----------|-----|
| **Google Play Console** | https://play.google.com/console/ |
| **PWABuilder** | https://www.pwabuilder.com/ |
| **PWABuilder Android Docs** | https://docs.pwabuilder.com/#/builder/android |
| **TWA Documentation** | https://developer.chrome.com/docs/android/trusted-web-activity |
| **Bubblewrap CLI** | https://github.com/nicedayfor/nicedayfor.github.io |
| **Digital Asset Links Generator** | https://developers.google.com/digital-asset-links/tools/generator |
| **Digital Asset Links Docs** | https://developers.google.com/digital-asset-links/v1/getting-started |
| **Capacitor Docs** | https://capacitorjs.com/docs |
| **Capacitor Android** | https://capacitorjs.com/docs/android |
| **Play Store Launch Checklist** | https://developer.android.com/distribute/best-practices/launch/launch-checklist |
| **Play Store Content Policy** | https://play.google.com/about/developer-content-policy/ |
| **PWA Checklist** | https://web.dev/pwa-checklist/ |
| **Android App Signing** | https://developer.android.com/studio/publish/app-signing |
| **IARC Rating** | https://www.globalratings.com/ |
| **Maskable Icon Editor** | https://maskable.app/ |
| **Lighthouse PWA Audit** | https://developer.chrome.com/docs/lighthouse/pwa/ |
| **Web Push Notifications** | https://web.dev/push-notifications-overview/ |
| **Mauritius Data Protection Act** | https://dataprotection.govmu.org/ |
