import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fredi.minhasviagens',
  appName: 'Minhas Viagens',
  webDir: 'dist',
  server: {
    url: 'https://a27d7c25-be2d-432e-bc62-f22f4e705cb3.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
};

export default config;
