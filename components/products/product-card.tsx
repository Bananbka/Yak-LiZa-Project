"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Lock } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter } from "../ui/card"
import { useAppDispatch, useAppSelector } from "../../../e-commerce/lib/store/hooks"
import { addToCart } from "../../../e-commerce/lib/store/slices/cartSlice"
import { toggleFavorite } from "../../../e-commerce/lib/store/slices/favoritesSlice"
import type { Product } from "../../../e-commerce/types/product"
import { useToast } from "../../../e-commerce/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()
  const favorites = useAppSelector((state) => state.favorites.items)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const isFavorite = favorites.some((item) => item.id === product.id)

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Потрібна авторизація",
        description: "Увійдіть до системи, щоб додати товари до кошика",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    dispatch(addToCart(product))
    toast({
      title: "Додано до кошика",
      description: `${product.title} додано до вашого кошика`,
    })
  }

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast({
        title: "Потрібна авторизація",
        description: "Увійдіть до системи, щоб додати товари до улюбленого",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    dispatch(toggleFavorite(product))
    toast({
      title: isFavorite ? "Видалено з улюбленого" : "Додано до улюбленого",
      description: isFavorite ? `${product.title} видалено з улюбленого` : `${product.title} додано до улюбленого`,
    })
  }

  const imageUrl = product.images[0] || "/placeholder.svg?height=300&width=300"

  return (
    <Card className=" flex flex-col h-full group overflow-hidden hover:shadow-lg transition-shadow ">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <CardContent className="flex flex-col p-4 flex-grow">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="flex-grow text-sm text-muted-foreground mb-2">{product.category.name}</p>
        <p className="text-2xl font-bold">${product.price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button onClick={handleAddToCart} className="flex-1" variant={!isAuthenticated ? "secondary" : "default"}>
          {!isAuthenticated ? <Lock className="h-4 w-4 mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
          {!isAuthenticated ? "Увійти" : "До кошика"}
        </Button>
        <Button
          variant={isFavorite ? "default" : "outline"}
          size="icon"
          onClick={handleToggleFavorite}
          disabled={!isAuthenticated}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
      </CardFooter>
    </Card>
  )
}
