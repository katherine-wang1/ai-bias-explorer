export type IssueType =
  | 'assumption'
  | 'bias'
  | 'missing-perspective'
  | 'power-dynamic'
  | 'language'
  | 'information-asymmetry';

export type Severity = 'low' | 'medium' | 'high';

export interface BiasSegment {
  id: string;
  text: string;
  issueType: IssueType;
  severity: Severity;
  shortLabel: string;
  detailedAnalysis: string;
  startIndex: number;
  endIndex: number;
}

export interface StructuredCritique {
  segments: BiasSegment[];
  overallSummary: string;
  positiveAspects: string;
}

export interface Message {
  id: string;
  timestamp: Date;
  userQuestion: string;
  originalResponse: string | null;
  critiqueResponse: string | null;
  structuredCritique: StructuredCritique | null;
  selectedSegmentId: string | null;
  status: 'pending' | 'answering' | 'critiquing' | 'complete' | 'error';
  error?: string;
}

export interface ChatStore {
  messages: Message[];
  apiKey: string | null;
  isProcessing: boolean;
  setApiKey: (key: string) => void;
  addMessage: (question: string) => Promise<void>;
  setSelectedSegment: (messageId: string, segmentId: string | null) => void;
  clearMessages: () => void;
}
