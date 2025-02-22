import * as v from 'valibot';

export const CLIENT_ENV_PREFIX = 'PUBLIC_' as const;

export const envSchema = v.object({
  /**
   * This is the backend API server. Note that this should
   * be passed as a build-time variable (ARG) in docker.
   */
  PUBLIC_SERVER_URL: v.pipe(v.string(), v.url()),
});

export const env = v.parse(envSchema, import.meta.env);
