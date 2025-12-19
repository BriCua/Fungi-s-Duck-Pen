import { db } from './init'
import { 
  doc,
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc,
} from 'firebase/firestore'
import type { ChatMessage } from '../types/chat'

export const chatService = {
  // Listen to couple's chat messages in real-time
  subscribeToChat(coupleId: string, callback: (messages: ChatMessage[]) => void) {
    const q = query(
      collection(db, 'chats', coupleId, 'messages'),
    )
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        ...doc.data(),
        msgId: doc.id,
      } as ChatMessage))
      
      // Sort by timestamp
      messages.sort((a, b) => a.timestamp - b.timestamp)
      callback(messages)
    })
  },

  // Send message
  async sendMessage(
    coupleId: string,
    senderUid: string,
    senderName: string,
    senderAvatar: string | undefined,
    content: string,
    mode: 'normal' | 'quackzulting' = 'normal'
  ): Promise<string> {
    const messageRef = await addDoc(collection(db, 'chats', coupleId, 'messages'), {
      coupleId,
      senderUid,
      senderName,
      senderAvatar,
      content,
      mode,
      timestamp: Date.now(),
      edited: false,
    })
    
    return messageRef.id
  },

  // Edit message
  async editMessage(coupleId: string, msgId: string, newContent: string): Promise<void> {
    await updateDoc(doc(db, 'chats', coupleId, 'messages', msgId), {
      content: newContent,
      edited: true,
      editedAt: Date.now(),
    })
  },
}
