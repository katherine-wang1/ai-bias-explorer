import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import { useChatStore } from './store/chatStore';

export default function App() {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);
  const { apiKey, setApiKey } = useChatStore();

  useEffect(() => {
    // Check for API key in environment
    const envKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (envKey) {
      setApiKey(envKey);
    } else {
      setShowApiKeySetup(true);
    }
  }, [setApiKey]);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setShowApiKeySetup(false);
    }
  };

  // Show API key setup screen if needed
  if (showApiKeySetup && !apiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Bias Explorer</h1>
          <p className="text-gray-600 mb-6">Enter your Anthropic API key to get started</p>

          <form onSubmit={handleApiKeySubmit}>
            <div className="mb-4">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                Anthropic API Key
              </label>
              <input
                id="apiKey"
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={!apiKeyInput.trim()}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Start Exploring
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-900">
            <p className="font-semibold mb-1">Don't have an API key?</p>
            <p>Get one at <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="underline">console.anthropic.com</a></p>
          </div>

          <div className="mt-4 p-4 bg-amber-50 rounded-lg text-xs text-amber-900">
            <p className="font-semibold mb-1">For instructors:</p>
            <p>Set VITE_ANTHROPIC_API_KEY in a .env file to bypass this screen</p>
          </div>
        </div>
      </div>
    );
  }

  return <ChatInterface />;
}
