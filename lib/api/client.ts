import axios, { type AxiosError, type AxiosRequestConfig } from "axios"
import type { ApiError } from "@/types/api"

const API_BASE_URL = "https://api.escuelajs.co/api/v1"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean
}

import type { AppDispatch, RootState } from "@/lib/store/store"

interface StoreRef {
  dispatch: AppDispatch
  getState: () => RootState
}

let storeRef: StoreRef | null = null

export const setStoreRef = (store: StoreRef) => {
  storeRef = store
}

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig

    if (error.response?.status === 401 && !originalRequest._retry && storeRef) {
      originalRequest._retry = true

      try {
        const { refreshAccessToken } = await import("@/lib/store/slices/authSlice")
        await storeRef.dispatch(refreshAccessToken())
        
        const newToken = localStorage.getItem('accessToken')

        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }

        return apiClient(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    const apiError: ApiError = {
      message: error.message || "An unexpected error occurred",
      statusCode: error.response?.status,
    }

    if (error.response) {
      const responseData = error.response.data as { message?: string | string[] };
      const message = Array.isArray(responseData.message) ? responseData.message.join(', ') : responseData.message;
      apiError.message = message || error.message;
    } else if (error.request) {
      apiError.message = "No response from server. Please check your connection."
    }

    return Promise.reject(apiError)
  },
)