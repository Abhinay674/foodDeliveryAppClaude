import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EXAMPLES = [
  { label: '📦 Delayed Order', text: 'My order is delayed and I want a refund' },
  { label: '🍕 Wrong Item', text: 'I ordered pizza but received a burger' },
  { label: '📋 Missing Item', text: 'One item is missing from my order' },
  { label: '💳 Payment Issue', text: 'I was charged twice for my order' },
];

const Support = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [finalMessage, setFinalMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setFinalMessage(null);
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/api/support/resolve`, { message });
      setFinalMessage(res.data.data.finalMessage);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessage('');
    setFinalMessage(null);
    setError(null);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4" style={{ backgroundColor: '#fff3ee' }}>
          🤖
        </div>
        <h1 className="text-2xl font-bold text-gray-800">How can we help you?</h1>
        <p className="text-gray-400 text-sm mt-1">Our AI support team is here for you</p>
      </div>

      {/* Show result OR input form */}
      {finalMessage ? (
        <div className="text-center">
          {/* Success icon */}
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-4">
            ✅
          </div>

          {/* Final message */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 text-left">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Support Response</p>
            <p className="text-gray-800 text-base leading-relaxed">{finalMessage}</p>
          </div>

          <button
            onClick={handleReset}
            className="text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 active:scale-95 transition"
            style={{ backgroundColor: '#FF5200' }}
          >
            Submit Another Issue
          </button>
        </div>

      ) : (
        <>
          {/* Quick examples */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">Quick select:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => setMessage(ex.text)}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-500 transition-all"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue here..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-orange-400 transition"
            />

            {error && (
              <p className="text-red-500 text-xs mt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="w-full mt-4 text-white font-bold py-3 rounded-full transition hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: '#FF5200' }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Getting your answer...</span>
                </>
              ) : (
                'Get Help'
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Support;
