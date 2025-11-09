import { publicApiClient } from "../../../../Desktop/e-commerce/lib/api/public-client"
import type { Product } from "@/types/product"

export const publicProductsApi = {
  async getAllProducts(): Promise<Product[]> {
    try {
      console.log('Calling public API for products...')
      const response = await publicApiClient.get<Product[]>("/products", {
        params: { 
          offset: 0, 
          limit: 100
        } 
      })
      console.log(`Public API returned ${response.data.length} products`)
      return response.data
    } catch (error) {
      console.error('Public API error:', error)
      throw error
    }
  },
}