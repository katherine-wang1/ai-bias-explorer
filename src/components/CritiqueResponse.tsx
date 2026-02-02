interface CritiqueResponseProps {
  response: string;
}

export default function CritiqueResponse({ response }: CritiqueResponseProps) {
  // Parse markdown-style headers and content
  const renderCritique = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let listKey = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="list-disc list-inside space-y-1 mb-3 text-gray-700">
            {currentList.map((item, idx) => (
              <li key={idx} className="ml-2">{item}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Headers (## Header)
      if (trimmed.startsWith('## ')) {
        flushList();
        const headerText = trimmed.substring(3);
        elements.push(
          <h4 key={`h-${idx}`} className="font-semibold text-amber-900 mt-4 mb-2 first:mt-0">
            {headerText}
          </h4>
        );
      }
      // Bullet points (- item or * item)
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        currentList.push(trimmed.substring(2));
      }
      // Regular paragraphs
      else if (trimmed) {
        flushList();
        elements.push(
          <p key={`p-${idx}`} className="mb-2 text-gray-700">
            {trimmed}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="bg-amber-50 rounded-lg p-4 md:p-6 border-l-4 border-amber-400">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🔍</span>
        <h3 className="font-semibold text-amber-900">Critical Analysis</h3>
        <span className="text-xs text-amber-700">(LLM #2)</span>
      </div>
      <div className="prose prose-sm max-w-none">
        {renderCritique(response)}
      </div>
    </div>
  );
}
