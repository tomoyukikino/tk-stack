import * as v from 'valibot';

const DEFAULT_API_PORT = 3035;
const DEFAULT_API_HOST = 'localhost';

const createPortSchema = ({ defaultPort }: { defaultPort: number }) =>
  v.pipe(
    v.optional(v.string(), `${defaultPort}`),
    v.transform((s) => parseInt(s, 10)),
    v.number(),
    v.minValue(0),
    v.maxValue(65535),
  );

export const envSchema = v.object({
  API_PORT: createPortSchema({ defaultPort: DEFAULT_API_PORT }),
  API_HOST: v.pipe(v.optional(v.string(), DEFAULT_API_HOST), v.minLength(1)),

  // This is use internally by better-auth in @repo/auth
  AUTH_SECRET:
    process.env.NODE_ENV === 'production'
      ? v.pipe(v.string(), v.minLength(1))
      : v.optional(v.pipe(v.string(), v.minLength(1))),

  DATABASE_URL: v.string(),
  PUBLIC_WEB_URL: v.pipe(v.string(), v.url()),
});

export const env = v.parse(envSchema, process.env);
