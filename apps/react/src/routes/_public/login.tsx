import { createFileRoute, Link } from '@tanstack/react-router'
import LoginCredentialsForm from '@/routes/_public/-components/login-form'

export const Route = createFileRoute('/_public/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-2 md:p-6 flex flex-col items-center">
      <div className="border p-4 md:p-8 w-full max-w-md rounded-lg bg-elevated">
        <LoginCredentialsForm />
        <div className="mt-4 text-center">
          {"Don't have an account? "}
          <Link to="/register" className="underline">
            Register
          </Link>
          !
        </div>
      </div>
    </div>
  )
}
