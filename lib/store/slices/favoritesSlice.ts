import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "@/types/product"
import { logout } from "./authSlice"

interface FavoritesState {
  items: Product[]
}

const loadFavoritesFromStorage = (): Product[] => {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem("favorites")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const saveFavoritesToStorage = (items: Product[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("favorites", JSON.stringify(items))
  } catch (error) {
    console.error("Failed to save favorites to localStorage:", error)
  }
}

const initialState: FavoritesState = {
  items: loadFavoritesFromStorage(),
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Product>) => {
      const existingIndex = state.items.findIndex((item) => item.id === action.payload.id)
      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1)
      } else {
        state.items.push(action.payload)
      }
      saveFavoritesToStorage(state.items)
    },
    clearFavorites: (state) => {
      state.items = []
      saveFavoritesToStorage(state.items)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.items = []
    })
  },
})

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer
