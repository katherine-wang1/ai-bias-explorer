import { useRef } from 'react';
import OriginalResponse from './OriginalResponse';
import CritiqueResponse from './CritiqueResponse';
import LoadingIndicator from './LoadingIndicator';
import InteractiveOriginalResponse from './InteractiveOriginalResponse';
import { Message } from '../types';
import { useChatStore } from '../store/chatStore';

interface ResponseDisplayProps {
  message: Message;
}

export default function ResponseDisplay({ message }: ResponseDisplayProps) {
  const { status, originalResponse, critiqueResponse, structuredCritique, selectedSegmentId, error } = message;
  const setSelectedSegment = useChatStore(state => state.setSelectedSegment);
  const responseContainerRef = useRef<HTMLDivElement>(null);

  // Show error state
  if (status === 'error') {
    return (
      <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-semibold">Error:</p>
        <p className="text-red-700">{error || 'An unknown error occurred'}</p>
      </div>
    );
  }

  // Show loading states
  if (status === 'pending' || status === 'answering' || status === 'critiquing') {
    return (
      <div className="my-4">
        {status === 'answering' && <LoadingIndicator status="answering" />}
        {status === 'critiquing' && originalResponse && (
          <>
            <div className="mb-4">
              <OriginalResponse response={originalResponse} />
            </div>
            <LoadingIndicator status="critiquing" />
          </>
        )}
      </div>
    );
  }

  // Show complete responses
  if (status === 'complete' && originalResponse) {
    // If we have structured critique, use interactive display
    if (structuredCritique) {
      const selectedSegment = structuredCritique.segments.find(
        seg => seg.id === selectedSegmentId
      ) || null;

      const handleSegmentClick = (segmentId: string) => {
        // Toggle: if already selected, deselect; otherwise select
        if (selectedSegmentId === segmentId) {
          setSelectedSegment(message.id, null);
        } else {
          setSelectedSegment(message.id, segmentId);
        }
      };

      const handleClose = () => {
        setSelectedSegment(message.id, null);
      };

      return (
        <div className="my-4">
          {/* Single-column layout with inline analysis */}
          <div ref={responseContainerRef}>
            <InteractiveOriginalResponse
              response={originalResponse}
              segments={structuredCritique.segments}
              selectedSegmentId={selectedSegmentId}
              onSegmentClick={handleSegmentClick}
              selectedSegment={selectedSegment}
              onCloseAnalysis={handleClose}
            />
          </div>

          {/* Overall summary with visual metrics */}
          {(structuredCritique.overallSummary || structuredCritique.positiveAspects) && (
            <div className="mt-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-300 p-6 shadow-sm">
              {/* Issue type breakdown with visual bars */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">📊</span>
                  Issue Breakdown
                </h4>
                <div className="space-y-2">
                  {(() => {
                    // Count issues by type
                    const typeCounts: Record<string, number> = {};
                    const typeLabels: Record<string, { label: string; icon: string; color: string }> = {
                      assumption: { label: 'Assumptions', icon: '🤔', color: 'bg-purple-500' },
                      bias: { label: 'Biases', icon: '⚖️', color: 'bg-orange-500' },
                      'missing-perspective': { label: 'Missing Perspectives', icon: '👥', color: 'bg-teal-500' },
                      'power-dynamic': { label: 'Power Dynamics', icon: '⚡', color: 'bg-indigo-500' },
                      language: { label: 'Language Issues', icon: '💬', color: 'bg-pink-500' },
                      'information-asymmetry': { label: 'Information Gaps', icon: '📊', color: 'bg-cyan-500' }
                    };

                    structuredCritique.segments.forEach(seg => {
                      typeCounts[seg.issueType] = (typeCounts[seg.issueType] || 0) + 1;
                    });

                    const totalIssues = structuredCritique.segments.length;

                    return Object.entries(typeCounts).map(([type, count]) => {
                      const percentage = (count / totalIssues) * 100;
                      const info = typeLabels[type];
                      return (
                        <div key={type} className="flex items-center gap-3">
                          <span className="text-sm w-4">{info.icon}</span>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium text-gray-700">{info.label}</span>
                              <span className="text-xs text-gray-600">{count}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`${info.color} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Severity indicator */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">🎯</span>
                  Severity Distribution
                </h4>
                <div className="space-y-2">
                  {(() => {
                    const severityCounts = { low: 0, medium: 0, high: 0 };
                    structuredCritique.segments.forEach(seg => {
                      severityCounts[seg.severity]++;
                    });
                    const total = structuredCritique.segments.length;

                    return [
                      { key: 'high', label: 'High', color: 'bg-red-500', count: severityCounts.high },
                      { key: 'medium', label: 'Medium', color: 'bg-yellow-500', count: severityCounts.medium },
                      { key: 'low', label: 'Low', color: 'bg-blue-500', count: severityCounts.low }
                    ].map(({ key, label, color, count }) => {
                      const percentage = total > 0 ? (count / total) * 100 : 0;
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-xs font-medium text-gray-700 w-16">{label}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`${color} h-2 rounded-full transition-all duration-500`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600 w-8 text-right">{count}</span>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Text summaries */}
              {structuredCritique.overallSummary && (
                <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="mr-2">💡</span>
                    Overall Patterns
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{structuredCritique.overallSummary}</p>
                </div>
              )}
              {structuredCritique.positiveAspects && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="text-sm font-semibold text-green-900 mb-2 flex items-center">
                    <span className="mr-2">✅</span>
                    Positive Aspects
                  </h4>
                  <p className="text-sm text-green-800 leading-relaxed">{structuredCritique.positiveAspects}</p>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // Fallback: use traditional display if no structured critique
    if (critiqueResponse) {
      return (
        <div className="my-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <OriginalResponse response={originalResponse} />
          </div>
          <div className="flex-1">
            <CritiqueResponse response={critiqueResponse} />
          </div>
        </div>
      );
    }
  }

  return null;
}
