import { RegisterForm } from "@/components/auth/register-form"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function RegisterPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
        <RegisterForm />
      </div>
    </AuthGuard>
  )
}
