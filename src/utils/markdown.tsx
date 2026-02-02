import React from 'react';

/**
 * Simple markdown parser for inline formatting
 * Supports: **bold**, *italic*, `code`, [links](url)
 */
export function parseInlineMarkdown(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/^\*\*(.*?)\*\*/);
    if (boldMatch) {
      nodes.push(<strong key={key++}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic: *text*
    const italicMatch = remaining.match(/^\*(.*?)\*/);
    if (italicMatch) {
      nodes.push(<em key={key++}>{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Code: `text`
    const codeMatch = remaining.match(/^`(.*?)`/);
    if (codeMatch) {
      nodes.push(
        <code key={key++} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Links: [text](url)
    const linkMatch = remaining.match(/^\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      nodes.push(
        <a
          key={key++}
          href={linkMatch[2]}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Regular text (up to next special character)
    const textMatch = remaining.match(/^[^*`\[]+/);
    if (textMatch) {
      nodes.push(textMatch[0]);
      remaining = remaining.slice(textMatch[0].length);
      continue;
    }

    // Fallback: add one character and continue
    nodes.push(remaining[0]);
    remaining = remaining.slice(1);
  }

  return nodes;
}

/**
 * Parse block-level markdown (headers, lists, paragraphs)
 */
export function parseBlockMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let key = 0;
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push(
        <ul key={key++} className="list-disc list-inside space-y-1 my-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-gray-800">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Headers: # Heading
    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
      flushList();
      blocks.push(
        <h2 key={key++} className="text-xl font-bold text-gray-900 mt-4 mb-3">
          {parseInlineMarkdown(trimmed.slice(2))}
        </h2>
      );
      continue;
    }

    // Headers: ## Heading
    if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      flushList();
      blocks.push(
        <h3 key={key++} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
          {parseInlineMarkdown(trimmed.slice(3))}
        </h3>
      );
      continue;
    }

    // Headers: ### Heading
    if (trimmed.startsWith('### ')) {
      flushList();
      blocks.push(
        <h4 key={key++} className="text-base font-semibold text-gray-900 mt-3 mb-1">
          {parseInlineMarkdown(trimmed.slice(4))}
        </h4>
      );
      continue;
    }

    // List items: - item or * item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listItems.push(trimmed.slice(2));
      continue;
    }

    // Regular paragraph
    flushList();
    blocks.push(
      <p key={key++} className="text-gray-800 my-2">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  }

  flushList();
  return blocks;
}
