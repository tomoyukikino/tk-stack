import { Toaster } from '@repo/ui/components/sonner';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import React from 'react';
import { authClient } from '@/clients/authClient';
import NavContainer from '@/routes/-components/layout/nav/nav-container';
import { Navbar } from '@/routes/-components/layout/nav/navbar';
import Spinner from '@/routes/-components/layout/spinner';

export const Route = createRootRoute({
  component: RootComponent,
});

// https://tanstack.com/router/v1/docs/framework/react/devtools
const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    );

function RootComponent() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <>
        <NavContainer>
          <Spinner />
        </NavContainer>
      </>
    );
  }

  return (
    <>
      <Navbar session={session} />
      <Toaster
        toastOptions={{
          classNames: {
            // !important to override: https://github.com/shadcn-ui/ui/issues/3579
            error: '!border-none !bg-toast-error !text-foreground',
            info: '!border-none !bg-toast-info !text-foreground',
            loading: '!border-none !bg-toast-loading !text-foreground',
            success: '!border-none !bg-toast-success !text-foreground',
            warning: '!border-none !bg-toast-warning !text-foreground',
          },
        }}
      />
      <div className="p-2 md:p-4">
        <Outlet />
      </div>
      <React.Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </React.Suspense>
    </>
  );
}
