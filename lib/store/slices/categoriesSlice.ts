import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { categoriesApi } from "@/lib/api/categories"
import type { Category } from "@/types/product"
import type { ApiError } from "@/types/api"

interface CategoriesState {
  items: Category[]
  loading: boolean
  error: string | null
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const categories = await categoriesApi.getCategories()
      return categories
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  },
)

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch categories"
      })
  },
})

export const { clearError } = categoriesSlice.actions
export default categoriesSlice.reducer
