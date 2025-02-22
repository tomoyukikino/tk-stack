import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import type { DatabaseInstance } from '@repo/db/client';

export interface AuthOptions {
  webUrl: string;
  db: DatabaseInstance;
}

export type AuthInstance = ReturnType<typeof betterAuth>;

export const createAuth = ({ webUrl, db }: AuthOptions): AuthInstance => {
  return betterAuth({
    trustedOrigins: [webUrl],
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      requireEmailVerification: false,
    },
  });
};
