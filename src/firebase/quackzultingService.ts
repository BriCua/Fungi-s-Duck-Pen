import { db } from './init'
import { 
  addDoc,
  collection,
  query,
  onSnapshot,
} from 'firebase/firestore'
import type { QuackzultingMessage } from '../types/quackzulting'
import { aiService } from '../services/aiService'

export const quackzultingService = {
  // Create new quackzulting session
  async createSession(uid: string, coupleId: string): Promise<string> {
    const sessionRef = await addDoc(collection(db, 'quackzulting', uid, 'sessions'), {
      coupleId,
      createdAt: Date.now(),
      status: 'active',
    })
    
    return sessionRef.id
  },

  // Add message to session
  async addMessage(
    uid: string,
    sessionId: string,
    content: string,
  ): Promise<void> {
    // Add user's message
    await addDoc(
      collection(db, 'quackzulting', uid, 'sessions', sessionId, 'messages'),
      {
        role: 'user',
        content,
        timestamp: Date.now(),
      }
    )

    // Get and add Dr. Kwuk's response
    const drKwukResponse = await aiService.getDrKwukResponse(content);
    await addDoc(
      collection(db, 'quackzulting', uid, 'sessions', sessionId, 'messages'),
      {
        role: 'dr_kwuk',
        content: drKwukResponse,
        timestamp: Date.now() + 1, // Ensure Dr. Kwuk's message is after the user's
      }
    )
  },

  // Subscribe to session messages
  subscribeToSession(
    uid: string,
    sessionId: string,
    callback: (messages: QuackzultingMessage[]) => void
  ) {
    const q = query(
      collection(db, 'quackzulting', uid, 'sessions', sessionId, 'messages')
    )
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        ...doc.data(),
        msgId: doc.id,
      } as QuackzultingMessage))
      
      messages.sort((a, b) => a.timestamp - b.timestamp)
      callback(messages)
    })
  },

  // Send summary to partner
  async sendSummaryToPartner(
    partnerUid: string,
    summary: string,
    suggestedActions: string[],
    moodEmoji: string,
    hintLevel: number
  ): Promise<void> {
    await addDoc(
      collection(db, 'notifications', partnerUid, 'items'),
      {
        type: 'advice_summary',
        title: 'Dr. Kwuk has advice for you 🦆',
        summary,
        suggestedActions,
        moodEmoji,
        hintLevel,
        timestamp: Date.now(),
        read: false,
      }
    )
  },
}
