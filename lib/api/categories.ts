import { apiClient } from "../../../../Desktop/e-commerce/lib/api/client"
import type { Category } from "@/types/product"

export const categoriesApi = {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>("/categories")
    return response.data
  },

  async getCategoryById(id: number): Promise<Category> {
    const response = await apiClient.get<Category>(`/categories/${id}`)
    return response.data
  },
}
