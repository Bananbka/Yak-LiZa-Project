"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { useAppDispatch, useAppSelector } from "../../../e-commerce/lib/store/hooks"
import { setCurrentPage } from "../../../e-commerce/lib/store/slices/productsSlice"

export function Pagination() {
  const dispatch = useAppDispatch()
  const { currentPage, hasMore } = useAppSelector((state) => state.products)

  const handlePrevious = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1))
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleNext = () => {
    if (hasMore) {
      dispatch(setCurrentPage(currentPage + 1))
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button variant="outline" onClick={handlePrevious} disabled={currentPage === 1}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Попередня
      </Button>
      <span className="text-sm text-muted-foreground">Сторінка {currentPage}</span>
      <Button variant="outline" onClick={handleNext} disabled={!hasMore}>
        Наступна
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )
}
