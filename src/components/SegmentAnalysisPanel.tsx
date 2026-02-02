import { BiasSegment, IssueType, Severity } from '../types';

interface SegmentAnalysisPanelProps {
  segment: BiasSegment | null;
  onClose: () => void;
}

// Issue type labels with icons
const issueTypeLabels: Record<IssueType, { label: string; icon: string; color: string }> = {
  assumption: { label: 'Assumption', icon: '🤔', color: 'bg-purple-100 text-purple-800' },
  bias: { label: 'Bias', icon: '⚖️', color: 'bg-orange-100 text-orange-800' },
  'missing-perspective': { label: 'Missing Perspective', icon: '👥', color: 'bg-teal-100 text-teal-800' },
  'power-dynamic': { label: 'Power Dynamic', icon: '⚡', color: 'bg-indigo-100 text-indigo-800' },
  language: { label: 'Language', icon: '💬', color: 'bg-pink-100 text-pink-800' },
  'information-asymmetry': { label: 'Information Asymmetry', icon: '📊', color: 'bg-cyan-100 text-cyan-800' }
};

// Severity labels with colors
const severityLabels: Record<Severity, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-blue-100 text-blue-800' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  high: { label: 'High', color: 'bg-red-100 text-red-800' }
};

export default function SegmentAnalysisPanel({ segment, onClose }: SegmentAnalysisPanelProps) {
  // Don't render if no segment selected
  if (!segment) {
    return null;
  }

  // Selected state: show segment analysis
  const issueInfo = issueTypeLabels[segment.issueType];
  const severityInfo = severityLabels[segment.severity];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-300">
      {/* Header with close button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="mr-2">🔍</span>
          Analysis
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Close analysis"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Issue type and severity badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${issueInfo.color}`}>
          <span className="mr-1">{issueInfo.icon}</span>
          {issueInfo.label}
        </span>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${severityInfo.color}`}>
          {severityInfo.label} severity
        </span>
      </div>

      {/* Short label */}
      <div className="mb-4">
        <h4 className="text-md font-semibold text-gray-800">{segment.shortLabel}</h4>
      </div>

      {/* Quoted text */}
      <div className="mb-4 p-4 bg-gray-50 border-l-4 border-gray-400 rounded">
        <p className="text-sm font-medium text-gray-600 mb-1">Quoted text:</p>
        <p className="text-gray-800 italic">"{segment.text}"</p>
      </div>

      {/* Detailed analysis */}
      <div className="prose prose-sm max-w-none">
        <p className="text-sm font-medium text-gray-700 mb-2">Analysis:</p>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {segment.detailedAnalysis}
        </p>
      </div>
    </div>
  );
}
