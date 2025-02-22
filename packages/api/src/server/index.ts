import type { AuthInstance } from '@repo/auth/server';
import type { DatabaseInstance } from '@repo/db/client';
import postRouter from './router/post';
import { createTRPCContext, router } from './trpc';

export { createTRPCContext };

export const createAPI = ({
  auth,
  db,
}: {
  auth: AuthInstance;
  db: DatabaseInstance;
}) => {
  return {
    trpcRouter: router({
      posts: postRouter,
    }),
    createContext: ({ headers }: { headers: Headers }) =>
      createTRPCContext({ auth, db, headers }),
  };
};

export const appRouter = router({
  posts: postRouter,
});

export type AppRouter = typeof appRouter;
