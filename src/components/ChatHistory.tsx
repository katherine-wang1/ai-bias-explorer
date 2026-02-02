import { useEffect, useRef } from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import ResponseDisplay from './ResponseDisplay';

interface ChatHistoryProps {
  messages: Message[];
}

export default function ChatHistory({ messages }: ChatHistoryProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageCountRef = useRef(messages.length);

  // Auto-scroll to bottom only when new messages are added (not when content changes)
  useEffect(() => {
    if (messages.length > messageCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      messageCountRef.current = messages.length;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to AI Bias Explorer
          </h2>
          <p className="text-gray-600 mb-6">
            This educational tool helps you understand biases and assumptions in AI responses.
            Ask any question, and you'll see both a typical AI answer and a critical analysis
            examining biases, missing perspectives, and power dynamics.
          </p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-left">
            <p className="font-semibold text-indigo-900 mb-2">Example questions to try:</p>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>• Should we increase the minimum wage?</li>
              <li>• Should ICE be allowed to use force?</li>
              <li>• What's the best immigration policy?</li>
              <li>• How should we regulate social media?</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {messages.map((message) => (
          <div key={message.id}>
            <MessageBubble
              question={message.userQuestion}
              timestamp={message.timestamp}
            />
            <ResponseDisplay message={message} />
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
