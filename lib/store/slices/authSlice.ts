import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { authApi } from "@/lib/api/auth"
import type { AuthState, LoginCredentials, RegisterData, User } from "@/types/auth"

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
}

const loadFromStorage = (): Partial<AuthState> => {
  if (typeof window === "undefined") return {}

  try {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    const user = userStr ? JSON.parse(userStr) : null

    return {
      accessToken,
      refreshToken,
      user,
      isAuthenticated: !!accessToken && !!user,
    }
  } catch {
    return {}
  }
}

const saveToStorage = (accessToken: string, refreshToken: string, user: User) => {
  if (typeof window === "undefined") return

  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

const clearStorage = () => {
  if (typeof window === "undefined") return

  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
  localStorage.removeItem("cart")
  localStorage.removeItem("favorites")
}

export const login = createAsyncThunk("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const tokens = await authApi.login(credentials)
    const user = await authApi.getProfile(tokens.access_token)
    saveToStorage(tokens.access_token, tokens.refresh_token, user)
    return { ...tokens, user }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Login failed")
    }
    return rejectWithValue("Помилка входу! Перевірте ваші дані.")
  }
})

export const register = createAsyncThunk("auth/register", async (data: RegisterData, { rejectWithValue }) => {
  try {
    const user = await authApi.register(data)
    const tokens = await authApi.login({
      email: data.email,
      password: data.password,
    })
    saveToStorage(tokens.access_token, tokens.refresh_token, user)
    return { ...tokens, user }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Registration failed")
    }
    return rejectWithValue("Помилка реєстрації!")
  }
})

export const refreshAccessToken = createAsyncThunk("auth/refreshToken", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { auth: AuthState }
    const { refreshToken } = state.auth

    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const tokens = await authApi.refreshToken(refreshToken)
    const user = await authApi.getProfile(tokens.access_token)
    saveToStorage(tokens.access_token, tokens.refresh_token, user)
    return { ...tokens, user }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Token refresh failed")
    }
    return rejectWithValue("An unknown error occurred during token refresh")
  }
})

export const loadUserFromStorage = createAsyncThunk("auth/loadFromStorage", async (_, { rejectWithValue }) => {
  try {
    const stored = loadFromStorage()
    if (!stored.accessToken || !stored.user) {
      throw new Error("No stored auth data")
    }

    const user = await authApi.getProfile(stored.accessToken)
    return {
      access_token: stored.accessToken,
      refresh_token: stored.refreshToken!,
      user,
    }
  } catch (error: unknown) {
    clearStorage()
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Failed to load user")
    }
    return rejectWithValue("An unknown error occurred while loading user")
  }
})

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
      clearStorage()
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.accessToken = action.payload.access_token
        state.refreshToken = action.payload.refresh_token
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.accessToken = action.payload.access_token
        state.refreshToken = action.payload.refresh_token
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.access_token
        state.refreshToken = action.payload.refresh_token
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        clearStorage()
      })

    builder
      .addCase(loadUserFromStorage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.isLoading = false
        state.accessToken = action.payload.access_token
        state.refreshToken = action.payload.refresh_token
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer