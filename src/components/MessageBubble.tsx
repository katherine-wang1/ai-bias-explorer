interface MessageBubbleProps {
  question: string;
  timestamp: Date;
}

export default function MessageBubble({ question, timestamp }: MessageBubbleProps) {
  const formattedTime = timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="mb-4">
      <div className="flex items-start gap-2">
        <span className="text-2xl">💬</span>
        <div className="flex-1">
          <div className="bg-indigo-600 text-white rounded-lg px-4 py-3 inline-block max-w-2xl">
            <p className="text-sm md:text-base">{question}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-1">{formattedTime}</p>
        </div>
      </div>
    </div>
  );
}
