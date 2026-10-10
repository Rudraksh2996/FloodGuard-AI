import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.floodguard.ai',
  appName: 'FloodGuard AI',
  webDir: 'public',
  server: {
    url: 'https://floodguard-ai.vercel.app',
    cleartext: false,
    androidScheme: 'https',
    allowNavigation: [
      'floodguard-ai.vercel.app',
      'tile.openstreetmap.org',
      'server.arcgisonline.com',
      'api.open-meteo.com',
      'api.rainviewer.com',
      'tilecache.rainviewer.com'
    ]
  },
  plugins: {
    SplashScreen: {
      backgroundColor: '#000000',
      launchShowDuration: 1500,
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000'
    }
  }
};

export default config;
