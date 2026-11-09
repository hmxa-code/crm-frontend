"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/src/services/authService'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'

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
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
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

  const handleBackToHome = () => {
    router.push('/')
  }

  return (
    <div className="w-full max-w-[480px]">
      {/* Back to Home Button */}
      <div className="mb-8">
        <button
          type="button"
          onClick={handleBackToHome}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#00AEEF] transition-colors group"
        >
          <div className="p-1.5 rounded-full bg-slate-100 group-hover:bg-[#00AEEF]/10 transition-colors">
            <FiArrowLeft size={16} />
          </div>
          <span>Back to Home</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Welcome back
        </h1>
        <p className="text-slate-500 text-[15px]">
          Sign in to your WholCure CRM account
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Email address
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10"
            placeholder="you@company.com"
            required
          />
        </div>

        {/* Password with Eye Icon */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Password
            </label>
            {/* <a
              href="/forgot-password"
              className="text-sm text-[#00AEEF] hover:text-[#0084C7] font-semibold transition-colors"
            >
              Forgot password?
            </a> */}
          </div>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              className="w-full h-11 px-4 pr-11 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00AEEF] transition-colors"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 mt-4 bg-gradient-to-r from-[#00AEEF] to-[#0084C7] hover:from-[#0084C7] hover:to-[#0066FF] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-[#00AEEF]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
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
      <p className="mt-8 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <a href="/register" className="font-semibold text-[#00AEEF] hover:text-[#0084C7] transition-colors">
          Create account
        </a>
      </p>

    </div>
  )
}