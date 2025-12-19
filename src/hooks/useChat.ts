import { useEffect, useState } from 'react'
import type { ChatMessage } from '../types/chat'

export const useChat = (coupleId: string | null) => {
  const [messages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!coupleId) return
    
    setLoading(true)
    // TODO: Subscribe to chat messages
    setLoading(false)
  }, [coupleId])

  const sendMessage = async () => {
    // TODO: Implement
  }

  return {
    messages,
    loading,
    sendMessage,
  }
}
