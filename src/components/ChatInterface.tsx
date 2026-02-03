import { useChatStore } from '../store/chatStore';
import ChatHistory from './ChatHistory';
import MessageInput from './MessageInput';
import LoadingIndicator from './LoadingIndicator';

export default function ChatInterface() {
  const { messages, isProcessing, addMessage, clearMessages } = useChatStore();

  const handleSendMessage = async (message: string) => {
    await addMessage(message);
  };

  // Check if any message is currently in 'critiquing' state
  const isCritiquing = messages.some(msg => msg.status === 'critiquing');

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              AI Bias Explorer
            </h1>
            <p className="text-sm text-gray-600">GSBGID517 Final Project: Understanding Bias and Assumptions in Chat</p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              disabled={isProcessing}
              className="text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Clear History
            </button>
          )}
        </div>
      </header>

      {/* Sticky Loading Banner for Second LLM */}
      {isCritiquing && (
        <div className="sticky top-0 z-10 bg-indigo-50 border-b border-indigo-200 px-4 py-3 shadow-sm">
          <div className="max-w-6xl mx-auto">
            <LoadingIndicator status="critiquing" />
          </div>
        </div>
      )}

      {/* Chat History */}
      <ChatHistory messages={messages} />

      {/* Input Area */}
      <MessageInput onSendMessage={handleSendMessage} disabled={isProcessing} />
    </div>
  );
}
