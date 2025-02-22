import { createTrpcClient } from '@repo/api/client';
import { env } from '@repo/env';

export const trpcClient = createTrpcClient({ apiUrl: env.PUBLIC_API_URL });
