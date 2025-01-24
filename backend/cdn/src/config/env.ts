import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  PORT: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), {
      message: 'Is not a number',
    }),
});

const { data: env, success, error } = EnvSchema.safeParse(process.env);

if (!success) {
  console.error('Invalid environment variables:', error.format());
  process.exit(1);
}

export default env!;
