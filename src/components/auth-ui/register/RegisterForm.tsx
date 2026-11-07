"use client"
import { useState } from 'react'
import { FiArrowRight } from 'react-icons/fi'

interface FormData {
  firstName: string
  lastName: string
  companyName: string
  jobTitle: string
  email: string
  phone: string
  message: string
}

export const RegisterForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    companyName: '',
    jobTitle: '',
    email: '',
    phone: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // Static for now – just simulate success
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  if (submitted) {
    return (
      <div className="w-full max-w-[480px] text-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          Request Submitted
        </h1>
        <p className="text-slate-500 text-[15px] leading-relaxed mb-8">
          Thank you! Your request has been sent to the CoreSphere team.  
          We will review your details and get back to you shortly.
        </p>
        <a
          href="/login"
          className="inline-flex items-center gap-2 text-sky-600 font-medium hover:text-sky-700 transition-colors"
        >
          Back to Sign in
          <FiArrowRight size={16} />
        </a>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[520px]">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sky-600 text-xs font-semibold tracking-widest uppercase mb-2">
          Access Request
        </p>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Request Access
        </h1>
        <p className="text-slate-500 text-[15px]">
          Fill in your details and our team will review your request.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              placeholder="Your first name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              placeholder="Your last name"
              required
            />
          </div>
        </div>

        {/* Company + Job Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              placeholder="Your company"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              name="jobTitle"
              type="text"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              placeholder="Your role"
              required
            />
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Work Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              placeholder="you@company.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              placeholder="+92 300 1234567"
              required
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              How can we help? <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-slate-400">
              {formData.message.length} / 1000
            </span>
          </div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            maxLength={1000}
            className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 resize-none"
            placeholder="Tell us about your team, use case, or any specific requirements..."
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
              Sending request...
            </>
          ) : (
            <>
              Send Request
              <FiArrowRight size={18} />
            </>
          )}
        </button>
        <p className='text-black'>NOTE THIS IS STATIC FORM RIGHT NOW DYNAMIC WORK WILL DONE AS SOON....</p>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-sky-600 hover:text-sky-700 transition-colors">
          Sign in
        </a>
      </p>
    </div>
  )
}