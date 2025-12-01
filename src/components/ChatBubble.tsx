import type { ChatMessage } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
  isSelf: boolean;
}

export const ChatBubble = ({ message, isSelf }: ChatBubbleProps) => {
  const bubbleClasses = isSelf
    ? 'bg-duck-yellow self-end'
    : 'bg-white self-start';
  const timestampClasses = isSelf ? 'text-right' : 'text-left';

  return (
    <div className={`flex flex-col mb-4 ${isSelf ? 'items-end' : 'items-start'}`}>
      <div className={`rounded-lg p-3 max-w-xs md:max-w-md ${bubbleClasses}`}>
        <p className="text-sm">{message.content}</p>
      </div>
      <span className={`text-xs text-gray-500 mt-1 ${timestampClasses}`}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
};
