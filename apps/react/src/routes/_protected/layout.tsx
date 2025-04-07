import { Navigate, Outlet, createFileRoute } from '@tanstack/react-router'
import { authClient } from '@/clients/authClient'
import Spinner from '@/routes/-components/common/spinner'

export const Route = createFileRoute('/_protected')({
  component: Layout,
})

function Layout() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <Spinner />
  }

  if (!session?.user) {
    return <Navigate to="/" />
  }

  return <Outlet />
}
