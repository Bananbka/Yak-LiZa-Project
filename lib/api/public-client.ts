import axios from "axios"

const API_BASE_URL = "https://api.escuelajs.co/api/v1"

export const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})