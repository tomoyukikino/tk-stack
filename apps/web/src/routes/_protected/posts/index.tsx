import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import {
  postsSearchSchema,
  postsSearchDefaults,
} from '@/validations/posts-link-options';
import { queryClient, trpc } from '@/router';

export const Route = createFileRoute('/_protected/posts/')({
  loader: () => queryClient.ensureQueryData(trpc.posts.all.queryOptions()),
  validateSearch: postsSearchSchema,
  search: {
    middlewares: [stripSearchParams(postsSearchDefaults)],
  },
});
