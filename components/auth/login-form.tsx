"use client"

import type React from "react"

import {useState} from "react"
import {useRouter} from "next/navigation"
import Link from "next/link"
import {useAppDispatch, useAppSelector} from "@/lib/store/hooks"
import {login, clearError} from "@/lib/store/slices/authSlice"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {Loader2} from "lucide-react"

export function LoginForm() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {isLoading, error} = useAppSelector((state) => state.auth)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(clearError())

        const result = await dispatch(login({email, password}))

        if (login.fulfilled.match(result)) {
            router.push("/")
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Вхід</CardTitle>
                <CardDescription>Увійдіть до свого облікового запису</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@mail.com"
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
                        />
                    </div>

                    <div className="text-sm text-muted-foreground">
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Увійти
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        Немає облікового запису?{" "}
                        <Link href="/register" className="text-primary hover:underline">
                            Зареєструватися
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}
