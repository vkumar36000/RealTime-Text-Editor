import React, { useState } from 'react'

interface LoginModalProps {
  onSubmit: (username: string) => void
}

export default function LoginModal({ onSubmit }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  // Simple email validation regex
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')
    onSubmit(email.trim())
  }

  const handleContinueAsGuest = () => {
    onSubmit('anonymous')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Enter Your Email</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Join
          </button>
        </form>

        {/* Continue as Guest Option */}
        <button
          onClick={handleContinueAsGuest}
          className="mt-4 text-blue-600 hover:underline text-sm text-center"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  )
}
