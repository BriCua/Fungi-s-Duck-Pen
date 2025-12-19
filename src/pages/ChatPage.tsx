import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { chatService } from '../firebase/chatService';
import type { ChatMessage } from '../types/chat';
import { ChatBubble } from '../components/ChatBubble';
import { ChatInput } from '../components/ChatInput';
import { Spinner } from '../components/ui';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui';
import { QuackzultingPage } from './QuackzultingPage';

export const ChatPage = () => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'normal' | 'quackzulting'>('normal');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.coupleId) return;

    const unsubscribe = chatService.subscribeToChat(user.coupleId, (newMessages) => {
      setMessages(newMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.coupleId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (!user?.coupleId || !user.uid || !user.displayName) return;
    chatService.sendMessage(user.coupleId, user.uid, user.displayName, user.photoURL, content, mode);
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

  if (mode === 'quackzulting') {
    return <QuackzultingPage />;
  }

  return (
    <Layout>
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-center justify-center mb-4">
          <Button onClick={() => setMode('quackzulting')} variant="secondary">
            Switch to Quackzulting Mode
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {messages.map((msg) => (
            <ChatBubble key={msg.msgId} message={msg} isSelf={msg.senderUid === user?.uid} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </Layout>
  );
};
