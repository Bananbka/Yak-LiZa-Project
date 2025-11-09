import Link from "next/link"
import { PackageX, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProductNotFound() {
  return (
    <div className="container min-h-[calc(100vh-200px)] flex items-center justify-center py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full animate-pulse" />
          <PackageX className="h-32 w-32 mx-auto text-destructive relative" strokeWidth={1.5} />
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-br from-destructive to-destructive/50 bg-clip-text text-transparent">
            Товар не знайдено
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-md mx-auto">
            Цей товар більше не доступний або його ID неправильний. Можливо, він був видалений з каталогу або
            розпроданий.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Search className="h-5 w-5" />
              Переглянути каталог
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2 bg-transparent">
            <Link href="/">
              <Home className="h-5 w-5" />
              На головну
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
