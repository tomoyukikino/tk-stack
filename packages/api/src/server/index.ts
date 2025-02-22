import type { AuthInstance } from '@repo/auth/server';
import postRouter from './router/post';
import { createTRPCContext, router } from './trpc';

export { createTRPCContext };

export const createAPI = (auth: AuthInstance) => {
  return {
    trpcRouter: router({
      posts: postRouter,
    }),
    createContext: ({ headers }: { headers: Headers }) =>
      createTRPCContext({ auth, headers }),
  };
};

export const appRouter = router({
  posts: postRouter,
});

export type AppRouter = typeof appRouter;
