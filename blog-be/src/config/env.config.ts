import { getEnv } from '@/common/utils/get-env';

export const Env = {
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: parseInt(getEnv('PORT', '5000')),
  DATABASE_URL: getEnv('DATABASE_URL'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),
  COOKIE_MAX_AGE: getEnv('COOKIE_MAX_AGE', '1h'),
  CLOUDINARY_CLOUD_NAME: getEnv('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: getEnv('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: getEnv('CLOUDINARY_API_SECRET'),
  MAX_SLUG_LENGTH: parseInt(getEnv('MAX_SLUG_LENGTH')),
} as const;
