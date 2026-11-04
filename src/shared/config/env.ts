import Config from 'react-native-config';

export const APP_ENVS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const;

export const config = {
  appEnv: Config.APP_ENV || APP_ENVS.DEVELOPMENT,
  appName: Config.APP_NAME || 'Instagram',
  apiUrl: Config.API_URL || 'https://insta-backend-xi.vercel.app/api',
  applicationId: Config.APPLICATION_ID || 'com.instagram',
  isDev: Config.APP_ENV === APP_ENVS.DEVELOPMENT,
  isStage: Config.APP_ENV === APP_ENVS.STAGING,
  isProd: Config.APP_ENV === APP_ENVS.PRODUCTION,
};

export const BASE_URL = config.apiUrl;

export const ENV = {
  API_BASE_URL: config.apiUrl,
};

export default config;
