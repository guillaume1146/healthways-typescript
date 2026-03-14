import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mediwyz.app',
  appName: 'MediWyz',
  webDir: 'out',
  server: {
    // Point to the live production URL — WebView loads the responsive mobile site
    url: 'https://mediwyz.com',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#2563EB',
      showSpinner: true,
      spinnerColor: '#FFFFFF',
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#2563EB',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
  ios: {
    scheme: 'MediWyz',
  },
  android: {
    allowMixedContent: false,
    // Force mobile viewport
    overrideUserAgent: 'MediWyz-Android',
  },
};

export default config;
