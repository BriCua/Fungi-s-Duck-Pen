import { useState } from 'react'
import { Button, Input, Card } from '../components/ui'
import { authService } from '../firebase/authService'

interface AuthPageProps {
  onAuthSuccess?: () => void
}

export const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        await authService.signUp(email, password, displayName)
      } else {
        await authService.signIn(email, password)
      }
      onAuthSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    try {
      await authService.signInWithGoogle()
      onAuthSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFC857 0%, #FFE08D 25%, #FFDB58 50%, #FFD580 75%, #FFC857 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      <Card className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-4">
          <img src='src\assets\images\bebekz-1.webp' className="text-5xl mb-2" />
          <h1 className="text-2xl font-bold text-duck-yellow">Fungi's Duck Pen</h1>
          <p className="text-gray-600 text-xs mt-1">Your relationship sanctuary</p>
        </div>

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3 mb-4">
          {isSignUp && (
            <Input
              label="Display Name"
              placeholder="Your name"
              value={displayName}
              onChange={setDisplayName}
              disabled={loading}
            />
          )}
          
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            disabled={loading}
            error={error ? 'Invalid email' : ''}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            disabled={loading}
            error={error ? 'Invalid password' : ''}
          />

          {error && (
            <div className="p-2 bg-red-100 border border-red-300 rounded-lg text-red-700 text-xs">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || !email || !password || (isSignUp && !displayName)}
            loading={loading}
            className="w-full mt-1"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Google Sign In */}
        <Button
          variant="secondary"
          size="lg"
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="w-full mb-3"
        >
          <span>🔐</span>
          Sign in with Google
        </Button>

        {/* Toggle Sign Up / Sign In */}
        <div className="text-center">
          <p className="text-gray-600 text-xs">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-pond-blue hover:underline font-semibold"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  )
}
