"use client"

import type React from "react"

import {useState} from "react"
import {useRouter} from "next/navigation"
import Link from "next/link"
import {useAppDispatch, useAppSelector} from "@/lib/store/hooks"
import {register, clearError} from "@/lib/store/slices/authSlice"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {Loader2} from "lucide-react"

export function RegisterForm() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {isLoading, error} = useAppSelector((state) => state.auth)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [validationError, setValidationError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(clearError())
        setValidationError("")

        if (password !== confirmPassword) {
            setValidationError("Паролі не співпадають")
            return
        }

        if (password.length < 6) {
            setValidationError("Пароль повинен містити мінімум 6 символів")
            return
        }

        const result = await dispatch(register({name, email, password}))

        if (register.fulfilled.match(result)) {
            router.push("/")
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Реєстрація</CardTitle>
                <CardDescription>Створіть новий обліковий запис</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {(error || validationError) && (
                        <Alert variant="destructive">
                            <AlertDescription>{error || validationError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Ім&apos;я</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Іван Іваненко"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="ivan@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            minLength={6}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Підтвердіть пароль</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            minLength={6}
                        />
                    </div>

                    <div className="text-sm text-muted-foreground">
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Зареєструватися
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        Вже є обліковий запис?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Увійти
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}