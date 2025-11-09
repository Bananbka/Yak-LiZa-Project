"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/products/product-grid"
import { useAppSelector } from "@/lib/store/hooks"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function FavoritesPage() {
  const favoriteItems = useAppSelector((state) => state.favorites.items)

  return (
    <AuthGuard requireAuth={true}>
      {favoriteItems.length === 0 ? (
        <div className="container py-16">
          <div className="max-w-md mx-auto text-center space-y-6">
            <Heart className="h-24 w-24 mx-auto text-muted-foreground" />
            <h1 className="text-3xl font-bold">Список улюбленого порожній</h1>
            <p className="text-muted-foreground">Додайте товари до улюбленого, щоб зберегти їх на потім</p>
            <Button asChild size="lg">
              <Link href="/">Перейти до каталогу</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Улюблене</h1>
            <p className="text-muted-foreground">
              У вас {favoriteItems.length} {favoriteItems.length === 1 ? "улюблений товар" : "улюблених товарів"}
            </p>
          </div>

          <ProductGrid products={favoriteItems} />
        </div>
      )}
    </AuthGuard>
  )
}
