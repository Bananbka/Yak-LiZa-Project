"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { removeFromCart, updateQuantity, clearCart } from "@/lib/store/slices/cartSlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { toast } from "@/hooks/use-toast"

export default function CartPage() {
    const dispatch = useAppDispatch()
    const cartItems = useAppSelector((state) => state.cart.items)

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const handleUpdateQuantity = (id: number, quantity: number) => {
        dispatch(updateQuantity({ id, quantity }))
    }

    const handleRemove = (id: number) => {
        dispatch(removeFromCart(id))
    }

    const handleClearCart = () => {
        dispatch(clearCart())
    }

    const handleCheckout = () => {
        toast({
            title: "Замовлення оформлено!",
            description: `Ваше замовлення на суму $${total.toFixed(2)} успішно оформлено. Очікуйте дзвінка менеджера.`,
            duration: 5000,
        })
        
        setTimeout(() => {
            dispatch(clearCart())
        }, 100)
    }

    return (
        <AuthGuard requireAuth={true}>
            {cartItems.length === 0 ? (
                <div className="container py-16">
                    <div className="max-w-md mx-auto text-center space-y-6">
                        <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground" />
                        <h1 className="text-3xl font-bold">Ваш кошик порожній</h1>
                        <p className="text-muted-foreground">Додайте товари до кошика, щоб продовжити покупки</p>
                        <Button asChild size="lg">
                            <Link href="/">Перейти до каталогу</Link>
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="container py-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-4xl font-bold">Кошик</h1>
                        <Button variant="outline" onClick={handleClearCart}>
                            Очистити кошик
                        </Button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <Card key={item.id}>
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                <Image
                                                    src={item.images[0] || "/placeholder.svg?height=96&width=96" || "/placeholder.svg"}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <Link href={`/products/${item.id}`} className="font-semibold hover:text-primary line-clamp-2">
                                                    {item.title}
                                                </Link>
                                                <p className="text-sm text-muted-foreground mt-1">{item.category.name}</p>
                                                <p className="font-bold mt-2">${item.price}</p>
                                            </div>

                                            <div className="flex flex-col items-end justify-between">
                                                <Button variant="ghost" size="icon" onClick={() => handleRemove(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 bg-transparent"
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 bg-transparent"
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div>
                            <Card className="sticky top-20">
                                <CardContent className="p-6 space-y-4">
                                    <h2 className="text-xl font-bold">Підсумок замовлення</h2>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Товарів ({cartItems.length})</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Доставка</span>
                                            <span>Безкоштовно</span>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Всього</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Button className="w-full" size="lg" onClick={handleCheckout}>
                                        Оформити замовлення
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </AuthGuard>
    )
}