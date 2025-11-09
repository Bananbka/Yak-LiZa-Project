import { configureStore } from "@reduxjs/toolkit"
import productsReducer from "./slices/productsSlice"
import cartReducer from "./slices/cartSlice"
import favoritesReducer from "./slices/favoritesSlice"
import categoriesReducer from "./slices/categoriesSlice"
import authReducer from "./slices/authSlice"
import { setStoreRef } from "@/lib/api/client"

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    categories: categoriesReducer,
    auth: authReducer,
  },
})

setStoreRef(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch