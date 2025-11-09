import { LoginForm } from "@/components/auth/login-form"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
        <LoginForm />
      </div>
    </AuthGuard>
  )
}
