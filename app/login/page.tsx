import { LoginForm } from "../../../Yak-LiZa-Project/.idea/components/auth/login-form"
import { AuthGuard } from "../../../Yak-LiZa-Project/.idea/components/auth/auth-guard"

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
        <LoginForm />
      </div>
    </AuthGuard>
  )
}
