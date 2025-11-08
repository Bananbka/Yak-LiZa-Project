"use client"

import {useState, useEffect} from "react"
import {useRouter, useSearchParams} from "next/navigation"
import {Search, X} from "lucide-react"
import {Input} from "../ui/input"
import {Button} from "../ui/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select"
import {useAppSelector, useAppDispatch} from "../../../e-commerce/lib/store/hooks"
import {setFilters} from "../../../e-commerce/lib/store/slices/productsSlice"
import {fetchCategories} from "../../../e-commerce/lib/store/slices/categoriesSlice"
import {Slider} from "../ui/slider"

interface ProductFiltersProps {
    minPrice?: number
    maxPrice?: number
}

export function ProductFilters({minPrice = 0, maxPrice = 1000}: ProductFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const dispatch = useAppDispatch()
    const categories = useAppSelector((state) => state.categories.items)

    const [title, setTitle] = useState(searchParams.get("title") || "")
    const [priceMin, setPriceMin] = useState(searchParams.get("price_min") || String(minPrice))
    const [priceMax, setPriceMax] = useState(searchParams.get("price_max") || String(maxPrice))
    const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "0")


    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    const handleApplyFilters = () => {
        const params = new URLSearchParams()
        if (title) params.set("title", title)
        if (priceMin) params.set("price_min", priceMin)
        if (priceMax) params.set("price_max", priceMax)
        if (categoryId !== "0") params.set("categoryId", categoryId)

        router.push(`/?${params.toString()}`)

        dispatch(
            setFilters({
                title: title || undefined,
                price_min: priceMin ? Number(priceMin) : undefined,
                price_max: priceMax ? Number(priceMax) : undefined,
                categoryId: categoryId !== "0" ? Number(categoryId) : undefined,
            }),
        )
    }

    const handleClearFilters = () => {
        setTitle("")
        setPriceMin("")
        setPriceMax("")
        setCategoryId("0")
        router.push("/")
        dispatch(setFilters({}))
    }

    const hasActiveFilters = title || priceMin || priceMax || categoryId !== "0"

    return (
        <div className="bg-card rounded-lg border p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Фільтри</h2>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-8">
                        <X className="h-4 w-4 mr-1"/>
                        Очистити
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">Пошук за назвою</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="Введіть назву товару..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Ціна</label>
                        <Slider
                            value={[Number(priceMin), Number(priceMax)]}
                            onValueChange={(value) => {
                                setPriceMin(String(value[0]))
                                setPriceMax(String(value[1]))
                            }}
                            min={minPrice}
                            max={maxPrice}
                            step={Math.max(1, Math.round((maxPrice - minPrice) / 100))}
                            className="my-4"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{Number(priceMin).toFixed(0)} $</span>
                            <span>{Number(priceMax).toFixed(0)} $</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Категорія</label>
                        <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Всі категорії"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Всі категорії</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={String(category.id)}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleApplyFilters} className="w-full">
                        Застосувати
                    </Button>
                </div>
            </div>
        </div>
    )
}