import { apiClient } from "../../../../Desktop/e-commerce/lib/api/client"
import type { LoginCredentials, RegisterData, AuthTokens, User } from "@/types/auth"

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>("/auth/login", credentials)
    return response.data
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await apiClient.post<User>("/users", {
      ...data,
      avatar: data.avatar || "https://api.lorem.space/image/face?w=640&h=480",
    })
    return response.data
  },

  getProfile: async (token: string): Promise<User> => {
    const response = await apiClient.get<User>("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>("/auth/refresh-token", {
      refreshToken,
    })
    return response.data
  },
}
