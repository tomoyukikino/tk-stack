import { createAuthClient, type AuthClient } from '@repo/auth/client';
import { env } from '@/env';

export const authClient: AuthClient = createAuthClient({
  apiBaseUrl: env.PUBLIC_SERVER_URL,
});

export type AuthSession = AuthClient['$Infer']['Session'] | null;
