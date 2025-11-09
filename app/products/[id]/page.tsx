"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, ShoppingCart, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchProductById } from "@/lib/store/slices/productsSlice"
import { addToCart } from "@/lib/store/slices/cartSlice"
import { toggleFavorite } from "@/lib/store/slices/favoritesSlice"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types/product"
import { ProductNotFound } from "@/components/products/product-not-found"


export async function generateStaticParams() {
    const products = await fetch('https://api.escuelajs.co/api/v1/products').then(res => res.json())

    return products.slice(0, 20).map((product: any) => ({
        id: product.id.toString(),
    }))
}
export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)

  const favorites = useAppSelector((state) => state.favorites.items)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const isFavorite = product ? favorites.some((item) => item.id === product.id) : false

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await dispatch(fetchProductById(Number(id))).unwrap()
        setProduct(result)
      } catch (err) {
        setError(err as string)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id, dispatch])

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

    if (product) {
      dispatch(addToCart(product))
      toast({
        title: "Додано до кошика",
        description: `${product.title} додано до вашого кошика`,
      })
    }
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

    if (product) {
      dispatch(toggleFavorite(product))
      toast({
        title: isFavorite ? "Видалено з улюбленого" : "Додано до улюбленого",
        description: isFavorite ? `${product.title} видалено з улюбленого` : `${product.title} додано до улюбленого`,
      })
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return <ProductNotFound />
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Назад
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg?height=600&width=600" || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <Link
              href={`/?categoryId=${product.category.id}`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {product.category.name}
            </Link>
            <h1 className="text-3xl font-bold mt-2 text-balance">{product.title}</h1>
          </div>

          <div className="text-4xl font-bold">${product.price}</div>

          <p className="text-muted-foreground leading-relaxed text-pretty">{product.description}</p>

          <div className="flex gap-4">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="flex-1"
              variant={!isAuthenticated ? "secondary" : "default"}
            >
              {!isAuthenticated ? <Lock className="h-5 w-5 mr-2" /> : <ShoppingCart className="h-5 w-5 mr-2" />}
              {!isAuthenticated ? "Увійти для покупки" : "Додати до кошика"}
            </Button>
            <Button
              variant={isFavorite ? "default" : "outline"}
              size="lg"
              onClick={handleToggleFavorite}
              disabled={!isAuthenticated}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
