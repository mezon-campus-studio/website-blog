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

  // OAuth - Google
  GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID', ''),
  GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET', ''),
  GOOGLE_CALLBACK_URL: getEnv('GOOGLE_CALLBACK_URL', 'http://localhost:5000/api/auth/google/callback'),

  // OAuth - GitHub
  GITHUB_CLIENT_ID: getEnv('GITHUB_CLIENT_ID', ''),
  GITHUB_CLIENT_SECRET: getEnv('GITHUB_CLIENT_SECRET', ''),
  GITHUB_CALLBACK_URL: getEnv('GITHUB_CALLBACK_URL', 'http://localhost:5000/api/auth/github/callback'),

  // Frontend URL for redirect after OAuth
  FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:3000'),
} as const;
