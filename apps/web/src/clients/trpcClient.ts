import { createTrpcClient } from '@repo/api/client';
import { env } from '@/env';

export const trpcClient = createTrpcClient({
  serverUrl: env.PUBLIC_SERVER_URL,
});
