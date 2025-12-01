import { useState } from 'react'
import { Button, Input, Card } from '../components/ui'
import { createCouple, joinCoupleByCode } from '../firebase/coupleService'
import { useAuthContext } from '../context/AuthContext'

export const CoupleLinkingPage = () => {
  const { user, setUser, signOut } = useAuthContext()
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose')
  const [coupleCode, setCoupleCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedCode, setGeneratedCode] = useState('')
  const [error, setError] = useState('');
  const [codeGenerated, setCodeGenerated] = useState(false);
  const [newCoupleId, setNewCoupleId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateCouple = async () => {
    if (!user) {
      setError('User not found, please try logging out and back in.');
      return;
    }
    setLoading(true)
    setError('');
    try {
      const { inviteCode, coupleId } = await createCouple(user);
      setGeneratedCode(inviteCode);
      setNewCoupleId(coupleId);
      setCodeGenerated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (user && newCoupleId) {
      setUser({ ...user, coupleId: newCoupleId });
    }
  }

  const handleCopyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const handleJoinCouple = async () => {
    if (!user) {
      setError('User not found, please try logging out and back in.');
      return;
    }
    setLoading(true)
    setError('');
    try {
      const { coupleId } = await joinCoupleByCode(coupleCode, user);
      if (user) {
        setUser({ ...user, coupleId });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      // It's good practice to handle potential errors, e.g., show a notification
      console.error("Error signing out: ", err);
    }
  };

  if (mode === 'choose') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pond-blue-light via-soft-white to-duck-yellow-light flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="text-center space-y-6">
            <div>
              <img src='src\assets\images\bebekz-1.webp' className="text-4xl mb-2" />
              <h1 className="text-2xl font-bold text-pond-blue mb-2">Link Your Partner</h1>
              <p className="text-gray-600 text-sm">Start your duck pen journey together</p>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setMode('create')}
                className="w-full"
              >
                🦆 Create New Couple Profile
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => setMode('join')}
                className="w-full"
              >
                🔗 Join Your Partner
              </Button>
            </div>

            <p className="text-gray-600 text-xs">
              You'll need to share an invite code with your partner
            </p>
          </div>
        </Card>
        <div className="mt-4">
          <Button
            variant="tertiary"
            onClick={handleSignOut}
          >
            Logout
          </Button>
        </div>
      </div>
    )
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pond-blue-light via-soft-white to-duck-yellow-light flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="space-y-6">
            <div>
              <button
                onClick={() => setMode('choose')}
                className="text-pond-blue hover:underline text-sm mb-4"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-pond-blue">Create Couple Profile</h1>
              <p className="text-gray-600 text-sm mt-2">
                We'll generate an invite code to share with your partner
              </p>
            </div>

            <div className="bg-duck-yellow-light p-4 rounded-lg">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Your Invite Code</p>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <p className="text-2xl font-mono font-bold text-duck-yellow">
                    {generatedCode || '--------'}
                  </p>
                </div>
                {codeGenerated && (
                  <Button variant="tertiary" size="sm" onClick={handleCopyToClipboard}>
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                )}
              </div>
            </div>

            {error && (
              <div className="p-2 bg-red-100 border border-red-300 rounded-lg text-red-700 text-xs">
                {error}
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg border border-pond-blue-light">
              <p className="text-sm text-pond-blue">
                💡 <strong>Share this code</strong> with your partner. They'll use it to join your couple profile.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={codeGenerated ? handleContinue : handleCreateCouple}
              disabled={loading}
              loading={loading}
              className="w-full"
            >
              {codeGenerated ? 'Continue' : 'Generate Code'}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (mode === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pond-blue-light via-soft-white to-duck-yellow-light flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="space-y-6">
            <div>
              <button
                onClick={() => setMode('choose')}
                className="text-pond-blue hover:underline text-sm mb-4"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-pond-blue">Join Your Partner</h1>
              <p className="text-gray-600 text-sm mt-2">
                Enter the invite code your partner shared with you
              </p>
            </div>

            <div>
              <Input
                label="Invite Code"
                placeholder="e.g., ABC123"
                value={coupleCode}
                onChange={(val) => setCoupleCode(val.toUpperCase())}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2">
                6-character code, uppercase (e.g., DUCK42)
              </p>
            </div>

            {error && (
              <div className="p-2 bg-red-100 border border-red-300 rounded-lg text-red-700 text-xs">
                {error}
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg border border-pond-blue-light">
              <p className="text-sm text-pond-blue">
                ℹ️ Make sure you got the code directly from your partner!
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleJoinCouple}
              disabled={coupleCode.length !== 6 || loading}
              loading={loading}
              className="w-full"
            >
              Join Couple
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return null
}
