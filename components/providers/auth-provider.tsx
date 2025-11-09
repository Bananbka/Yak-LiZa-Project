"use client"

import type React from "react"

import { useEffect } from "react"
import { useAppDispatch } from "@/lib/store/hooks"
import { loadUserFromStorage } from "@/lib/store/slices/authSlice"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadUserFromStorage())
  }, [dispatch])

  return <>{children}</>
}
