import { create } from 'zustand';
import { ChatStore, Message } from '../types';
import { callAnswererLLM, callCriticLLM, formatCritiqueAsText } from '../services/llm-service';
import { initializeAnthropic } from '../services/anthropic';

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  apiKey: null,
  isProcessing: false,

  setApiKey: (key: string) => {
    initializeAnthropic(key);
    set({ apiKey: key });
  },

  addMessage: async (question: string) => {
    const messageId = Date.now().toString();
    const newMessage: Message = {
      id: messageId,
      timestamp: new Date(),
      userQuestion: question,
      originalResponse: null,
      critiqueResponse: null,
      structuredCritique: null,
      selectedSegmentId: null,
      status: 'pending'
    };

    // Add the message and set processing state
    set(state => ({
      messages: [...state.messages, newMessage],
      isProcessing: true
    }));

    try {
      // Step 1: Get response from LLM #1 (Answerer)
      set(state => ({
        messages: state.messages.map(msg =>
          msg.id === messageId ? { ...msg, status: 'answering' as const } : msg
        )
      }));

      const originalResponse = await callAnswererLLM(question);

      set(state => ({
        messages: state.messages.map(msg =>
          msg.id === messageId ? { ...msg, originalResponse } : msg
        )
      }));

      // Step 2: Get critical analysis from LLM #2 (Critic)
      set(state => ({
        messages: state.messages.map(msg =>
          msg.id === messageId ? { ...msg, status: 'critiquing' as const } : msg
        )
      }));

      const structuredCritique = await callCriticLLM(question, originalResponse);
      const critiqueResponse = formatCritiqueAsText(structuredCritique);

      // Mark as complete
      set(state => ({
        messages: state.messages.map(msg =>
          msg.id === messageId
            ? { ...msg, structuredCritique, critiqueResponse, status: 'complete' as const }
            : msg
        ),
        isProcessing: false
      }));
    } catch (error: any) {
      // Handle errors
      set(state => ({
        messages: state.messages.map(msg =>
          msg.id === messageId
            ? {
                ...msg,
                status: 'error' as const,
                error: error.message || 'An unknown error occurred'
              }
            : msg
        ),
        isProcessing: false
      }));
    }
  },

  setSelectedSegment: (messageId: string, segmentId: string | null) => {
    set(state => ({
      messages: state.messages.map(msg =>
        msg.id === messageId ? { ...msg, selectedSegmentId: segmentId } : msg
      )
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  }
}));
