import { db } from '@repo/db/client';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export interface AuthOptions {
  webUrl: string;
}

export type AuthInstance = ReturnType<typeof betterAuth>;

export const createAuth = ({ webUrl }: AuthOptions): AuthInstance => {
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
