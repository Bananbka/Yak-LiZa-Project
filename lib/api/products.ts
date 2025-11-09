import { apiClient } from "./client"
import { publicApiClient } from "./public-client"
import type { Product, ProductFilters, PaginationParams } from "@/types/product"

type ProductApiParams = {
  offset: number;
  limit: number;
  title?: string;
  price_min?: number;
  price_max?: number;
  categoryId?: number;
}

export const productsApi = {
  async getProducts(pagination: PaginationParams, filters?: ProductFilters): Promise<Product[]> {
    const params: ProductApiParams = {
      offset: pagination.offset,
      limit: pagination.limit,
    }

    if (filters?.title) {
      params.title = filters.title
    }
    if (filters?.price_min !== undefined) {
      params.price_min = filters.price_min
    }
    if (filters?.price_max !== undefined) {
      params.price_max = filters.price_max
    }
    if (filters?.categoryId) {
      params.categoryId = filters.categoryId
    }

    const response = await apiClient.get<Product[]>("/products", { params })
    return response.data
  },

  async getAllProducts(): Promise<Product[]> {
    const response = await publicApiClient.get<Product[]>("/products", {
      params: { 
        offset: 0, 
        limit: 1000 // Get all products for price range calculation
      } 
    })
    return response.data
  },

  async getProductById(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data
  },
}