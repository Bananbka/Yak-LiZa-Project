import Link from "next/link"
import { SearchX, Home, ArrowLeft } from "lucide-react"
import { Button } from "../../Yak-LiZa-Project/.idea/components/ui/button"

export default function NotFound() {
  return (
    <div className="container min-h-[calc(100vh-200px)] flex items-center justify-center py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <SearchX className="h-32 w-32 mx-auto text-primary relative" strokeWidth={1.5} />
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl font-bold bg-gradient-to-br from-primary to-primary/50 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-4xl font-bold text-balance">Сторінку не знайдено</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-md mx-auto">
            На жаль, сторінка, яку ви шукаєте, не існує або була переміщена. Можливо, вона була видалена або ви ввели
            неправильну адресу.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/public">
              <Home className="h-5 w-5" />
              На головну
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2 bg-transparent">
            <Link href="javascript:history.back()">
              <ArrowLeft className="h-5 w-5" />
              Назад
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
