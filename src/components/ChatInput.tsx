import { useState } from 'react';
import { Button, Input } from './ui';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSendMessage(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
      <Input
        value={content}
        onChange={setContent}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button type="submit" variant="primary" disabled={!content.trim()}>
        Send
      </Button>
    </form>
  );
};
