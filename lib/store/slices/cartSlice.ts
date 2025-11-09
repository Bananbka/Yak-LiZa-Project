import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Product, CartItem } from "@/types/product"
import { logout } from "./authSlice"

interface CartState {
  items: CartItem[]
}

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem("cart")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("cart", JSON.stringify(items))
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error)
  }
}

const initialState: CartState = {
  items: loadCartFromStorage(),
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      saveCartToStorage(state.items)
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      saveCartToStorage(state.items)
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity)
      }
      saveCartToStorage(state.items)
    },
    clearCart: (state) => {
      state.items = []
      saveCartToStorage(state.items)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.items = []
    })
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
