import { ArrowLeftIcon, ReloadIcon } from '@radix-ui/react-icons'
import { Button } from '@repo/ui/components/button'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, TooltipArrow } from '@repo/ui/components/tooltip'
import { createFileRoute, Link } from '@tanstack/react-router'
import { queryClient } from '@/clients/queryClient'
import { trpc } from '@/router'
import { postsLinkOptions } from '@/validations/posts-link-options'

export const Route = createFileRoute('/_protected/posts/$postid/')({
  loader: ({ params }) => queryClient.ensureQueryData(trpc.posts.one.queryOptions({ id: params.postid })),
  component: RouteComponent,
  errorComponent: ({ error, reset }) => {
    return (
      <div className="flex flex-col items-center w-full gap-y-3">
        <div>{error.message}</div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="w-full">
            <Link {...postsLinkOptions}>
              <ArrowLeftIcon />
              Go Back
            </Link>
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              // Reset the router error boundary
              reset()
            }}
            className="w-full"
          >
            Retry? <ReloadIcon />
          </Button>
        </div>
      </div>
    )
  },
})

function RouteComponent() {
  const post = Route.useLoaderData()

  return (
    <div className="flex flex-col px-4 w-full max-w-6xl mx-auto break-words">
      <div className="text-center p-5 rounded-2xl">
        <h1 className="text-2xl md:text-4xl font-bold">{post.title}</h1>
        <p className="text-sm text-gray-500 mt-2">
          Created by <span className="font-medium">{post.author.name}</span>, {post.createdAt.toLocaleString()}
        </p>
      </div>
      <hr className="border border-gray-500 mt-3" />

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="link" className="w-12 border border-gray-500 mt-6 hover:brightness-150">
              <Link {...postsLinkOptions}>
                <ArrowLeftIcon />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            sideOffset={4}
            className="bg-neutral-500 fill-neutral-500 duration-0"
          >
            <span>View all posts</span>
            <TooltipArrow width={15} height={10} className="duration-0" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="bg-elevated shadow rounded-2xl p-6 w-full min-h-96 border border-gray-500 break-words mt-6">
        <p className="leading-relaxed whitespace-break-spaces">{post.content ?? 'No content available.'}</p>
      </div>
    </div>
  )
}
