"use client"

import { useState } from 'react'
import { FiArrowRight, FiCheck, FiUser, FiMail, FiLock, FiBriefcase, FiCheckCircle, FiShield, FiArrowLeft } from 'react-icons/fi'
import { LuEye, LuEyeOff } from 'react-icons/lu'

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  companyName?: string
  jobTitle?: string
}

type Step = 1 | 2 | 3 | 4

const stepConfig = [
  { id: 1, label: 'Profile', icon: FiUser },
  { id: 2, label: 'Security', icon: FiLock },
  { id: 3, label: 'Company', icon: FiBriefcase },
  { id: 4, label: 'Review', icon: FiCheckCircle },
]

export const RegisterForm = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    jobTitle: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateStep = (step: Step): boolean => {
    const newErrors: Partial<FormData> = {}
    let isValid = true

    if (step === 1) {
      if (!formData.firstName?.trim()) {
        newErrors.firstName = 'First name is required'
        isValid = false
      }
      if (!formData.lastName?.trim()) {
        newErrors.lastName = 'Last name is required'
        isValid = false
      }
      if (!formData.email?.trim()) {
        newErrors.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
        isValid = false
      }
    }

    if (step === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required'
        isValid = false
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
        isValid = false
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter'
        isValid = false
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter'
        isValid = false
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number'
        isValid = false
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
        isValid = false
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match'
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => (prev < 4 ? ((prev + 1) as Step) : prev))
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => ((prev - 1) as Step))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(4)) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setSubmitted(true)
      }, 1500)
    }
  }

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-6 animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-gradient-to-br from-[#00AEEF] to-[#0084C7] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#00AEEF]/30">
          <FiCheck size={36} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Account Created!</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-5 text-left">
          <p className="text-sm text-slate-600 leading-relaxed text-center">
            Your account has been successfully created. Verification link sent to <br />
            <span className="font-semibold text-[#00AEEF]">{formData.email}</span>
          </p>
        </div>

        <p className="text-xs text-slate-500 mb-6 flex items-center justify-center gap-1.5">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#FFC20E]/20 text-[#FFC20E] text-[10px] font-bold">!</span>
          Demo version: System is under active development.
        </p>

        <a
          href="/login"
          className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#00AEEF] !text-white font-semibold text-sm hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20"
        >
          Go to Login <FiArrowRight size={18} />
        </a>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-0">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h2>
          <p className="text-xs text-slate-500 mt-1">Step {currentStep} of 4 — Setup your workspace credentials</p>
        </div>
      </div>

      {/* Multi-Step Progress Bar */}
      <div className="mb-8">
        <div className="grid grid-cols-4 gap-2">
          {stepConfig.map((s) => {
            const isActive = currentStep === s.id
            const isDone = currentStep > s.id
            return (
              <div key={s.id} className="flex flex-col gap-2">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isDone ? 'bg-[#8DC63F]' : isActive ? 'bg-[#00AEEF]' : 'bg-slate-200'
                  }`}
                />
                <span className={`text-[11px] font-semibold text-center hidden sm:block ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* STEP 1: Profile Setup */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiUser size={14} className="text-[#00AEEF]" /> First Name *
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Muhammad"
                    className={`w-full h-11 px-3.5 rounded-xl border text-sm text-slate-900 outline-none transition-all ${
                      errors.firstName ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10'
                    }`}
                  />
                  {errors.firstName && <p className="text-[11px] text-red-500 mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FiUser size={14} className="text-[#00AEEF]" /> Last Name *
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Hamza"
                    className={`w-full h-11 px-3.5 rounded-xl border text-sm text-slate-900 outline-none transition-all ${
                      errors.lastName ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10'
                    }`}
                  />
                  {errors.lastName && <p className="text-[11px] text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FiMail size={14} className="text-[#00AEEF]" /> Email Address *
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="hamza@company.com"
                  className={`w-full h-11 px-3.5 rounded-xl border text-sm text-slate-900 outline-none transition-all ${
                    errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>
          )}

          {/* STEP 2: Password Security & Requirements */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FiLock size={14} className="text-[#00AEEF]" /> Create Password *
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter strong password"
                    className={`w-full h-11 pl-3.5 pr-10 rounded-xl border text-sm text-slate-900 outline-none transition-all ${
                      errors.password ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}

                {/* Password Strength Meter */}
                <div className="mt-2.5 flex items-center gap-1.5 h-1">
                  <div className={`h-full flex-1 rounded-full transition-colors ${formData.password.length >= 8 ? 'bg-[#8DC63F]' : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full transition-colors ${/[A-Z]/.test(formData.password) ? 'bg-[#8DC63F]' : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full transition-colors ${/[0-9]/.test(formData.password) ? 'bg-[#8DC63F]' : 'bg-slate-200'}`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FiCheckCircle size={14} className="text-[#00AEEF]" /> Confirm Password *
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter password"
                    className={`w-full h-11 pl-3.5 pr-10 rounded-xl border text-sm text-slate-900 outline-none transition-all ${
                      errors.confirmPassword ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[11px] text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Password Requirements Checklist */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Password Requirements:</p>
                <div className={`flex items-center gap-2 text-[11px] ${formData.password.length >= 8 ? 'text-[#8DC63F]' : 'text-slate-400'}`}>
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] text-white ${formData.password.length >= 8 ? 'bg-[#8DC63F]' : 'bg-slate-200'}`}>✓</span>
                  At least 8 characters
                </div>
                <div className={`flex items-center gap-2 text-[11px] ${/[A-Z]/.test(formData.password) ? 'text-[#8DC63F]' : 'text-slate-400'}`}>
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] text-white ${/[A-Z]/.test(formData.password) ? 'bg-[#8DC63F]' : 'bg-slate-200'}`}>✓</span>
                  One uppercase & lowercase letter
                </div>
                <div className={`flex items-center gap-2 text-[11px] ${/[0-9]/.test(formData.password) ? 'text-[#8DC63F]' : 'text-slate-400'}`}>
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] text-white ${/[0-9]/.test(formData.password) ? 'bg-[#8DC63F]' : 'bg-slate-200'}`}>✓</span>
                  One number
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Company Details */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FiBriefcase size={14} className="text-[#00AEEF]" /> Company / Organization Name
                </label>
                <input
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="WholCure Technologies"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FiUser size={14} className="text-[#00AEEF]" /> Job Title / Role
                </label>
                <input
                  name="jobTitle"
                  type="text"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="Full Stack Developer / Manager"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/10"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Summary Review */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Full Name</span>
                  <span className="font-semibold text-slate-900">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Email Address</span>
                  <span className="font-semibold text-slate-900">{formData.email}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Organization</span>
                  <span className="font-semibold text-slate-900">{formData.companyName || 'Not specified'}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
                <span className="font-bold shrink-0 mt-0.5">!</span>
                <span>Demo version notice: System is under active development. Data will be saved in sandbox mode.</span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              >
                <FiArrowLeft size={14} /> Back
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 h-10 rounded-xl bg-[#00AEEF] !text-white text-xs font-semibold shadow-sm hover:bg-sky-600 transition-all ml-auto"
              >
                Next Step <FiArrowRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 h-10 rounded-xl bg-[#00AEEF] !text-white text-xs font-semibold shadow-sm hover:bg-sky-600 disabled:opacity-50 transition-all ml-auto"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Footer Sign In Link */}
      <p className="mt-6 text-center text-xs text-slate-500">
        Already have an workspace account?{' '}
        <a href="/login" className="font-semibold text-[#00AEEF] hover:underline">
          Sign in
        </a>
      </p>

      {/* Demo Notice Box */}
      <div className="mt-4 p-3 bg-slate-100/80 border border-slate-200 rounded-xl text-center">
        <p className="text-[11px] text-slate-600">
          <span className="font-bold text-[#FFC20E] mr-1">⚠️ DEMO NOTICE:</span> 
          System is currently under maintenance. Use this for evaluation purposes.
        </p>
      </div>
    </div>
  )
}