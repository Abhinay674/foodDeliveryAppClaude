/*
 * HOW THIS PAGE WORKS (simple explanation):
 *
 * 1. User types their complaint in the text area
 * 2. On submit → POST /api/support/resolve with the message
 * 3. Backend runs 3 agents in order and returns all results
 * 4. This page shows:
 *    - STEP 1 box: what Intent Agent understood
 *    - STEP 2 box: what Policy Agent decided
 *    - STEP 3 box: final reply from Resolution Agent
 *
 * This makes it educational — you can SEE the orchestration live!
 */

import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Icons as simple SVG (no extra library needed)
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// Shows one agent step in a nice card
// agentNumber: 1, 2, or 3
// title: "Intent Agent", "Policy Agent", "Resolution Agent"
// description: simple explanation of what this agent does
// data: the JSON this agent returned
const AgentStepCard = ({ agentNumber, title, description, data, color }) => (
  <div className={`rounded-2xl border-2 ${color.border} ${color.bg} p-4`}>
    {/* Header */}
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-8 h-8 rounded-full ${color.badge} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}>
        {agentNumber}
      </div>
      <div>
        <h3 className={`font-bold ${color.title}`}>{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className={`ml-auto ${color.check}`}>
        <CheckIcon />
      </div>
    </div>

    {/* The actual JSON output from this agent */}
    <div className="bg-gray-900 rounded-xl p-3 font-mono text-xs text-green-400 overflow-x-auto">
      <div className="text-gray-500 mb-1">// Agent returned:</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  </div>
);

// Quick example buttons so users can test easily
const EXAMPLES = [
  { label: '📦 Delayed Order', text: 'My order is delayed for 2 hours and I want a refund' },
  { label: '🍕 Wrong Item', text: 'I ordered pizza but received a burger. I want a replacement.' },
  { label: '📦 Missing Item', text: 'One item is missing from my order. Please replace it.' },
  { label: '💳 Payment Issue', text: 'I was charged twice for my order. I want a refund.' },
];

const Support = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);   // holds the full response from backend
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // ─── This single API call triggers all 3 agents on the backend ───
      // Backend does: intentAgent → policyAgent → resolutionAgent
      // Then returns all 3 results together
      const res = await axios.post(`${API_URL}/api/support/resolve`, { message });
      setResult(res.data.data);
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (text) => {
    setMessage(text);
    setResult(null);
    setError(null);
  };

  const handleReset = () => {
    setMessage('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      {/* Page header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-3xl mb-3" style={{ backgroundColor: '#fff3ee' }}>
          🤖
        </div>
        <h1 className="text-2xl font-bold text-gray-800">AI Customer Support</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Powered by 3 Claude AI agents working together
        </p>

        {/* Shows the agent flow visually */}
        <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
          {['Intent Agent', 'Policy Agent', 'Resolution Agent'].map((name, i) => (
            <React.Fragment key={name}>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">{name}</span>
              {i < 2 && <span className="text-gray-400 text-xs">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Quick example buttons */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2 font-medium">Try an example:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => handleExample(ex.text)}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-500 transition-all"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Describe your issue:
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. My order is delayed and I want a refund..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-orange-400 transition"
        />
        <div className="flex justify-between items-center mt-3">
          {result && (
            <button type="button" onClick={handleReset} className="text-sm text-gray-400 hover:text-gray-600">
              ← Start over
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="ml-auto flex items-center gap-2 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#FF5200' }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Agents working...</span>
              </>
            ) : (
              <>
                <SendIcon />
                <span>Get Help</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Loading state — show which agent is running */}
      {loading && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <p className="text-sm font-semibold text-gray-600 mb-4 text-center">
            ⚙️ Agents processing your request...
          </p>
          <div className="space-y-3">
            {['Intent Agent — understanding your issue...', 'Policy Agent — checking company rules...', 'Resolution Agent — writing your reply...'].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-orange-200 border-t-orange-500 animate-spin flex-shrink-0" style={{ animationDelay: `${i * 0.3}s` }} />
                <span className="text-sm text-gray-500">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* Results — show all 3 agent steps + final answer */}
      {result && (
        <div className="space-y-4">
          {/* Section label */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-400 font-medium">AGENT ORCHESTRATION TRACE</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* AGENT 1 result */}
          <AgentStepCard
            agentNumber={1}
            title="Intent Agent"
            description="Understood what the customer wants"
            data={result.steps.intent}
            color={{
              border: 'border-blue-200',
              bg: 'bg-blue-50',
              badge: 'bg-blue-500',
              title: 'text-blue-800',
              check: 'text-blue-500'
            }}
          />

          {/* Arrow between agents */}
          <div className="text-center text-gray-400 text-sm">↓ output passed to next agent</div>

          {/* AGENT 2 result */}
          <AgentStepCard
            agentNumber={2}
            title="Policy Agent"
            description="Checked company rules and decided action"
            data={result.steps.policy}
            color={{
              border: 'border-purple-200',
              bg: 'bg-purple-50',
              badge: 'bg-purple-500',
              title: 'text-purple-800',
              check: 'text-purple-500'
            }}
          />

          <div className="text-center text-gray-400 text-sm">↓ both results passed to next agent</div>

          {/* AGENT 3 result */}
          <AgentStepCard
            agentNumber={3}
            title="Resolution Agent"
            description="Generated the final customer reply"
            data={result.steps.resolution}
            color={{
              border: 'border-green-200',
              bg: 'bg-green-50',
              badge: 'bg-green-500',
              title: 'text-green-800',
              check: 'text-green-500'
            }}
          />

          {/* Final message card — what the customer actually sees */}
          <div
            className="rounded-2xl p-5 text-white text-center shadow-md"
            style={{ background: 'linear-gradient(135deg, #FF5200, #ff8c00)' }}
          >
            <p className="text-xs font-semibold opacity-80 mb-2 uppercase tracking-wide">
              ✅ Final Response to Customer
            </p>
            <p className="text-lg font-semibold leading-snug">
              {result.finalMessage}
            </p>
          </div>

          {/* Explanation box */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">How this worked:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>
                <span className="font-semibold text-blue-600">Step 1 (Intent):</span>{' '}
                AI identified issue as <code className="bg-gray-200 px-1 rounded">{result.steps.intent.issueType}</code>{' '}
                and action as <code className="bg-gray-200 px-1 rounded">{result.steps.intent.requestedAction}</code>
              </p>
              <p>
                <span className="font-semibold text-purple-600">Step 2 (Policy):</span>{' '}
                Action <code className="bg-gray-200 px-1 rounded">{result.steps.policy.actionType}</code>{' '}
                was {result.steps.policy.actionAllowed ? '✅ allowed' : '❌ not allowed'} — {result.steps.policy.reason}
              </p>
              <p>
                <span className="font-semibold text-green-600">Step 3 (Resolution):</span>{' '}
                Final reply generated using BOTH results above
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
