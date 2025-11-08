"use client"

import { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { ProductFilters } from "../../Yak-LiZa-Project/.idea/components/products/product-filters"
import { ProductGrid } from "../../Yak-LiZa-Project/.idea/components/products/product-grid"
import { Pagination } from "../../Yak-LiZa-Project/.idea/components/products/pagination"
import { useAppDispatch, useAppSelector } from "../../e-commerce/lib/store/hooks"
import { fetchProducts, setFilters, fetchAllProducts } from "../../e-commerce/lib/store/slices/productsSlice"
import { Spinner } from "../../Yak-LiZa-Project/.idea/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "../../Yak-LiZa-Project/.idea/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function HomePage() {
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const { items, loading, error, currentPage, allItems } = useAppSelector((state) => state.products)

  const calculatePriceRange = () => {
    const productsToUse = allItems.length > 0 ? allItems : items;
    
    if (productsToUse.length === 0) {
      return { min: 0, max: 1000 };
    }
    
    const min = Math.min(...productsToUse.map(p => p.price));
    const max = Math.max(...productsToUse.map(p => p.price));
    
    return { min, max };
  };

  const priceRange = calculatePriceRange();

  const prevFiltersRef = useRef<string>("")
  const prevPageRef = useRef<number>(0)
  const isFetchingRef = useRef(false)

  useEffect(() => {
    dispatch(fetchAllProducts())
      .unwrap()
      .then((products) => {
        console.log('fetchAllProducts succeeded, products count:', products.length)
      })
      .catch((error) => {
        console.error('fetchAllProducts failed:', error)
      })
  }, [dispatch])

  useEffect(() => {
    if (!searchParams) return

    const title = searchParams.get("title") || undefined
    const price_min = searchParams.get("price_min") ? Number(searchParams.get("price_min")) : undefined
    const price_max = searchParams.get("price_max") ? Number(searchParams.get("price_max")) : undefined
    const categoryId = searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined

    const newFilters = { title, price_min, price_max, categoryId }
    const filtersString = JSON.stringify(newFilters)

    if (filtersString !== prevFiltersRef.current) {
      prevFiltersRef.current = filtersString
      prevPageRef.current = 1
      dispatch(setFilters(newFilters))

      if (!isFetchingRef.current) {
        isFetchingRef.current = true
        dispatch(fetchProducts()).finally(() => {
          isFetchingRef.current = false
        })
      }
    } else if (currentPage !== prevPageRef.current && currentPage > 0) {
      prevPageRef.current = currentPage

      if (!isFetchingRef.current) {
        isFetchingRef.current = true
        dispatch(fetchProducts()).finally(() => {
          isFetchingRef.current = false
        })
      }
    }
  }, [searchParams, currentPage, dispatch])

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-balance">Інтернет-магазин</h1>
        <p className="text-muted-foreground text-lg">Знайдіть ідеальні товари для себе</p>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        <aside>
          <ProductFilters minPrice={priceRange.min} maxPrice={priceRange.max} />
        </aside>

        <div>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Помилка</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <>
              <ProductGrid products={items} />
              <Pagination />
            </>
          )}
        </div>
      </div>
    </div>
  )
}