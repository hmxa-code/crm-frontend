"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/src/services/authService'
import { FiArrowRight } from 'react-icons/fi'

interface FormData {
  email: string
  password: string
}

export const LoginForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await AuthService.login(formData.email, formData.password)
      AuthService.setAuthData(response.token, response.user)
      router.push(localStorage.getItem('last_visited_crm_route') || '/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[400px]">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Welcome back
        </h1>
        <p className="text-slate-500 text-[15px]">
          Sign in to your CoreSphere account
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Email address
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            placeholder="you@company.com"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <button
              type="button"
              className="text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            placeholder="••••••••"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 mt-2 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-400 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <FiArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-10 text-center text-sm text-slate-500">
        Don’t have an account?{' '}
        <a href="/register" className="font-medium text-sky-600 hover:text-sky-700 transition-colors">
          Create one
        </a>
      </p>
    </div>
  )
}