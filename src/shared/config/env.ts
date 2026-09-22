import Config from 'react-native-config';

export const config = {
  appEnv: Config.APP_ENV || 'development',
  appName: Config.APP_NAME || 'Instagram',
  apiUrl: Config.API_URL || 'https://insta-backend-xi.vercel.app/api',
  applicationId: Config.APPLICATION_ID || 'com.instagram',
  isDev: Config.APP_ENV === 'development',
  isStage: Config.APP_ENV === 'staging',
  isProd: Config.APP_ENV === 'production',
};

export const BASE_URL = config.apiUrl;

export const ENV = {
  API_BASE_URL: config.apiUrl,
};

export default config;
