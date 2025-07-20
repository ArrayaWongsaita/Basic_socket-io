import envSchema from '@/shared/schema/env.schema.js';

const env = import.meta.env;

const { success, data, error } = envSchema.safeParse(env);

if (!success) {
  console.error('Environment variables validation failed:', error);
  throw new Error('Invalid environment variables');
}

const envConfig = data;
export default envConfig;
