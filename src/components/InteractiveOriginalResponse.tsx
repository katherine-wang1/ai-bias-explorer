import { useEffect, useRef } from 'react';
import { BiasSegment, Severity } from '../types';
import { parseInlineMarkdown } from '../utils/markdown';
import SegmentAnalysisPanel from './SegmentAnalysisPanel';

interface InteractiveOriginalResponseProps {
  response: string;
  segments: BiasSegment[];
  selectedSegmentId: string | null;
  onSegmentClick: (segmentId: string) => void;
  selectedSegment: BiasSegment | null;
  onCloseAnalysis: () => void;
}

// Color mapping based on severity
const severityColors: Record<Severity, { bg: string; border: string; hover: string }> = {
  low: {
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    hover: 'hover:bg-blue-200'
  },
  medium: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-400',
    hover: 'hover:bg-yellow-200'
  },
  high: {
    bg: 'bg-red-100',
    border: 'border-red-400',
    hover: 'hover:bg-red-200'
  }
};

export default function InteractiveOriginalResponse({
  response,
  segments,
  selectedSegmentId,
  onSegmentClick,
  selectedSegment,
  onCloseAnalysis
}: InteractiveOriginalResponseProps) {
  const analysisPanelRef = useRef<HTMLDivElement>(null);

  // Sort segments by start index
  const sortedSegments = [...segments]
    .filter(seg => seg.startIndex !== -1) // Filter out segments that couldn't be matched
    .sort((a, b) => a.startIndex - b.startIndex);

  // Scroll to analysis panel when a segment is selected
  useEffect(() => {
    if (selectedSegmentId && analysisPanelRef.current) {
      analysisPanelRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selectedSegmentId]);

  // Helper to render a line with highlights applied
  const renderLineWithHighlights = (line: string, lineStart: number, displayText: string) => {
    // Find segments that intersect with this line
    const lineEnd = lineStart + line.length;
    const lineSegments = sortedSegments.filter(seg =>
      (seg.startIndex < lineEnd && seg.endIndex > lineStart)
    );

    if (lineSegments.length === 0) {
      return parseInlineMarkdown(displayText);
    }

    // Build parts with highlights, adjusting for the displayText offset
    const textStartOffset = line.indexOf(displayText);
    const parts: React.ReactNode[] = [];
    let lastPos = 0; // Position relative to displayText

    lineSegments.forEach((segment) => {
      // Convert global indices to line-relative indices
      const segStartInLine = Math.max(0, segment.startIndex - lineStart);
      const segEndInLine = Math.min(line.length, segment.endIndex - lineStart);

      // Convert line-relative to displayText-relative
      const segStartInDisplay = Math.max(0, segStartInLine - textStartOffset);
      const segEndInDisplay = Math.min(displayText.length, segEndInLine - textStartOffset);

      // Skip if segment doesn't overlap with displayText
      if (segStartInDisplay >= displayText.length || segEndInDisplay <= 0) {
        return;
      }

      // Add text before this segment
      if (segStartInDisplay > lastPos) {
        const textBefore = displayText.slice(lastPos, segStartInDisplay);
        parts.push(
          <span key={`text-${segment.id}-before`}>
            {parseInlineMarkdown(textBefore)}
          </span>
        );
      }

      // Add highlighted segment
      const isSelected = segment.id === selectedSegmentId;
      const colors = severityColors[segment.severity];
      const segmentText = displayText.slice(segStartInDisplay, segEndInDisplay);
      const segmentIndex = sortedSegments.indexOf(segment);

      parts.push(
        <span
          key={segment.id}
          className={`
            ${colors.bg} ${colors.hover}
            ${isSelected ? `${colors.border} border-2` : 'border border-transparent'}
            rounded px-1 cursor-pointer transition-colors relative inline-block
          `}
          onClick={() => onSegmentClick(segment.id)}
          title={segment.shortLabel}
        >
          {parseInlineMarkdown(segmentText)}
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gray-700 rounded-full ml-1 align-super">
            {segmentIndex + 1}
          </span>
        </span>
      );

      lastPos = segEndInDisplay;
    });

    // Add remaining text
    if (lastPos < displayText.length) {
      const textAfter = displayText.slice(lastPos);
      parts.push(
        <span key="text-end">
          {parseInlineMarkdown(textAfter)}
        </span>
      );
    }

    return parts.length > 0 ? parts : parseInlineMarkdown(displayText);
  };

  // Build highlighted text with segments, processing markdown line by line
  const renderHighlightedText = () => {
    const lines = response.split('\n');
    const blocks: React.ReactNode[] = [];
    let currentIndex = 0;
    let selectedSegmentBlockIndex: number | null = null;

    lines.forEach((line, idx) => {
      const lineStart = currentIndex;
      const lineEnd = lineStart + line.length;
      const trimmed = line.trim();

      // Check if this line contains the selected segment
      if (selectedSegment &&
          selectedSegment.startIndex < lineEnd &&
          selectedSegment.endIndex > lineStart) {
        selectedSegmentBlockIndex = blocks.length;
      }

      if (!trimmed) {
        blocks.push(<br key={idx} />);
        currentIndex += line.length + 1; // +1 for newline
        return;
      }

      // Headers: # Heading
      if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
        blocks.push(
          <h2 key={idx} className="text-xl font-bold mt-4 mb-3">
            {renderLineWithHighlights(line, lineStart, trimmed.slice(2))}
          </h2>
        );
      }
      // Headers: ## Heading
      else if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
        blocks.push(
          <h3 key={idx} className="text-lg font-semibold mt-3 mb-2">
            {renderLineWithHighlights(line, lineStart, trimmed.slice(3))}
          </h3>
        );
      }
      // Headers: ### Heading
      else if (trimmed.startsWith('### ')) {
        blocks.push(
          <h4 key={idx} className="text-base font-semibold mt-2 mb-1">
            {renderLineWithHighlights(line, lineStart, trimmed.slice(4))}
          </h4>
        );
      }
      // List items
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        blocks.push(
          <li key={idx} className="ml-4">
            {renderLineWithHighlights(line, lineStart, trimmed.slice(2))}
          </li>
        );
      }
      // Regular paragraph
      else {
        blocks.push(
          <p key={idx} className="mb-2">
            {renderLineWithHighlights(line, lineStart, trimmed)}
          </p>
        );
      }

      currentIndex += line.length + 1; // +1 for newline
    });

    // Insert the analysis panel after the block containing the selected segment
    if (selectedSegment && selectedSegmentBlockIndex !== null) {
      blocks.splice(
        selectedSegmentBlockIndex + 1,
        0,
        <div key="analysis-panel" ref={analysisPanelRef} className="my-4">
          <SegmentAnalysisPanel
            segment={selectedSegment}
            onClose={onCloseAnalysis}
          />
        </div>
      );
    }

    return <div className="text-gray-800 leading-relaxed">{blocks}</div>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">💬</span>
        Original Response
      </h3>

      {/* Legend */}
      {sortedSegments.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Click highlighted segments to view analysis:
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center">
              <span className="inline-block w-4 h-4 bg-blue-100 border border-blue-400 rounded mr-1"></span>
              <span>Low severity</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-4 h-4 bg-yellow-100 border border-yellow-400 rounded mr-1"></span>
              <span>Medium severity</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-4 h-4 bg-red-100 border border-red-400 rounded mr-1"></span>
              <span>High severity</span>
            </div>
          </div>
        </div>
      )}

      {/* Highlighted response text */}
      <div className="prose max-w-none">
        {renderHighlightedText()}
      </div>

      {/* Info about segments found */}
      {sortedSegments.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          {sortedSegments.length} issue{sortedSegments.length !== 1 ? 's' : ''} identified
        </div>
      )}
    </div>
  );
}
