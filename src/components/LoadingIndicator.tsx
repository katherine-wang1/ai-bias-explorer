interface LoadingIndicatorProps {
  status: 'answering' | 'critiquing';
}

export default function LoadingIndicator({ status }: LoadingIndicatorProps) {
  const message = status === 'answering'
    ? 'Getting initial response...'
    : 'Analyzing for biases and perspectives...';

  return (
    <div className="flex items-center gap-2 text-gray-600 py-4">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-sm">{message}</span>
    </div>
  );
}
