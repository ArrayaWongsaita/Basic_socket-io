import z from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url().default('http://localhost:3000'),
  VITE_SOCKET_URL: z.string().url().default('http://localhost:3000'),
});

export default envSchema;
