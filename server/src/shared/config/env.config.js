import zod from 'zod';
import 'dotenv/config.js';

const envSchema = zod.object({
  PORT: zod.coerce.number().default(3000),
  JWT_SECRET: zod.string().default('your-secret-key-change-in-production'),
  DATABASE_URL: zod.string().url().default('file:./dev.db'),
  NODE_ENV: zod.enum(['development', 'production']).default('development'),
});

const { success, data: envConfig, error } = envSchema.safeParse(process.env);

if (!success) {
  console.error('Invalid environment variables:', error);
  process.exit(1);
}

export default envConfig;
