import { getEnv } from "@/utils/get-env";

export const Env = {
   NODE_ENV: getEnv('NODE_ENV', 'development'),
   PORT: parseInt(getEnv('PORT', '5000')),
   DATABASE_URL: getEnv('DATABASE_URL'),
   JWT_SECRET: getEnv('JWT_SECRET'),
   JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),


} as const;