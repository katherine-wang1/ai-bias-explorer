import { parseInlineMarkdown } from '../utils/markdown';

interface OriginalResponseProps {
  response: string;
}

export default function OriginalResponse({ response }: OriginalResponseProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🤖</span>
        <h3 className="font-semibold text-gray-900">Original Answer</h3>
        <span className="text-xs text-gray-500">(LLM #1)</span>
      </div>
      <div className="prose prose-sm max-w-none text-gray-800">
        {response.split('\n').map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <br key={idx} />;

          // Headers
          if (trimmed.startsWith('## ')) {
            return <h3 key={idx} className="text-lg font-semibold mt-3 mb-2">{parseInlineMarkdown(trimmed.slice(3))}</h3>;
          }
          if (trimmed.startsWith('### ')) {
            return <h4 key={idx} className="text-base font-semibold mt-2 mb-1">{parseInlineMarkdown(trimmed.slice(4))}</h4>;
          }

          // List items
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return <li key={idx} className="ml-4">{parseInlineMarkdown(trimmed.slice(2))}</li>;
          }

          // Regular paragraph
          return <p key={idx} className="mb-2">{parseInlineMarkdown(trimmed)}</p>;
        })}
      </div>
    </div>
  );
}
