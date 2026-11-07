"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/src/services/authService'
import { LoginForm } from '@/src/components/auth-ui/login/LoginForm'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (AuthService.isAuthenticated()) {
        const lastRoute = localStorage.getItem('last_visited_crm_route') || '/dashboard'
        router.replace(lastRoute)
      }
    }
  }, [router])

  return <LoginForm />
}