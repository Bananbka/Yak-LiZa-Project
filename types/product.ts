export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: Category
  images: string[]
  creationAt?: string
  updatedAt?: string
}

export interface Category {
  id: number
  name: string
  image: string
  creationAt?: string
  updatedAt?: string
}

export interface ProductFilters {
  title?: string
  price_min?: number
  price_max?: number
  categoryId?: number
}

export interface CartItem extends Product {
  quantity: number
}

export interface PaginationParams {
  offset: number
  limit: number
}
