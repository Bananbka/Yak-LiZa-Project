import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { productsApi } from "@/lib/api/products"
import { publicProductsApi } from "@/lib/api/public-products"
import type { Product, ProductFilters, PaginationParams } from "@/types/product"
import type { ApiError } from "@/types/api"

interface ProductsState {
  items: Product[]
  allItems: Product[]
  loading: boolean
  error: string | null
  currentPage: number
  itemsPerPage: number
  filters: ProductFilters
  hasMore: boolean
}

const initialState: ProductsState = {
  items: [],
  allItems: [],
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 12,
  filters: {},
  hasMore: true,
}

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string; state: { products: ProductsState } }
>("products/fetchProducts", async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState().products
    const pagination: PaginationParams = {
      offset: (state.currentPage - 1) * state.itemsPerPage,
      limit: state.itemsPerPage,
    }
    const products = await productsApi.getProducts(pagination, state.filters)
    return products
  } catch (error) {
    const apiError = error as ApiError
    return rejectWithValue(apiError.message)
  }
})

export const fetchProductById = createAsyncThunk<Product, number, { rejectValue: string }>(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const product = await productsApi.getProductById(id)
      return product
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  },
)

export const fetchAllProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "products/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching all products for price range...')
      const products = await publicProductsApi.getAllProducts()
      console.log(`Fetched ${products.length} products for price range`)
      console.log('Price range:', {
        min: Math.min(...products.map(p => p.price)),
        max: Math.max(...products.map(p => p.price))
      })
      return products
    } catch (error) {
      console.error('Error fetching all products:', error)
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  },
)

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload
      state.currentPage = 1
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    clearFilters: (state) => {
      state.filters = {}
      state.currentPage = 1
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.hasMore = action.payload.length === state.itemsPerPage
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch products"
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch product"
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false
        state.allItems = action.payload
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch all products"
      })
  },
})

export const { setFilters, setCurrentPage, clearFilters, clearError } = productsSlice.actions
export default productsSlice.reducer