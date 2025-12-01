import { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { quackzultingService } from '../firebase/quackzultingService';
import type { QuackzultingMessage } from '../types';
import { ChatBubble } from '../components/ChatBubble';
import { ChatInput } from '../components/ChatInput';
import { Spinner } from '../components/ui';
import { Layout } from '../components/Layout';

export const QuackzultingPage = () => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<QuackzultingMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid || !user?.coupleId) return;

    const createSession = async () => {
      const newSessionId = await quackzultingService.createSession(user.uid, user.coupleId!);
      setSessionId(newSessionId);
    };

    createSession();
  }, [user?.uid, user?.coupleId]);

  useEffect(() => {
    if (!sessionId || !user?.uid) return;

    const unsubscribe = quackzultingService.subscribeToSession(user.uid, sessionId, (newMessages) => {
      setMessages(newMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sessionId, user?.uid]);

  const handleSendMessage = (content: string) => {
    if (!sessionId || !user?.uid) return;
    quackzultingService.addMessage(user.uid, sessionId, content);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  // Ensure user is not null for rendering ChatBubble props
  if (!user) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center text-red-500">
          Error: User data missing for Quackzulting.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.msgId}
              message={{
                ...msg,
                coupleId: user.coupleId || '', // Provide coupleId
                senderName: msg.role === 'user' ? user.displayName || 'You' : 'Dr. Kwuk', // Provide senderName
                mode: 'quackzulting',
                senderUid: msg.role === 'user' ? user.uid : 'dr_kwuk', // Provide senderUid
              }}
              isSelf={msg.role === 'user'}
            />
          ))}
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </Layout>
  );
};
