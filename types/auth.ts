export interface User {
  id: number
  email: string
  password: string
  name: string
  role: string
  avatar: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  avatar?: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
