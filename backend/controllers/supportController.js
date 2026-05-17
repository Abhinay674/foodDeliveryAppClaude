/*
 * ORCHESTRATOR — runs the 3 GPT-4.1 agents in sequence
 *
 * Each agent is async (makes a real API call to GPT-4.1).
 * We await each one and pass its output to the next.
 *
 * Flow:
 *   user message
 *       ↓  await
 *   intentAgent(message)                        → intentResult
 *       ↓  await  (receives intentResult)
 *   policyAgent(intentResult)                   → policyResult
 *       ↓  await  (receives intentResult + policyResult)
 *   resolutionAgent(intentResult, policyResult) → resolutionResult
 *       ↓
 *   return all 3 results to frontend
 */

const { intentAgent, policyAgent, resolutionAgent } = require('../services/agentService');

exports.resolveIssue = async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Please provide a message describing your issue.'
    });
  }

  try {
    // STEP 1 — Intent Agent (GPT-4.1 call #1)
    // Sends: raw user message
    // Gets : { issueType, requestedAction }
    const intentResult = await intentAgent(message.trim());

    // STEP 2 — Policy Agent (GPT-4.1 call #2)
    // Sends: intentResult from Step 1
    // Gets : { actionAllowed, actionType, reason }
    const policyResult = await policyAgent(intentResult);

    // STEP 3 — Resolution Agent (GPT-4.1 call #3)
    // Sends: intentResult (Step 1) + policyResult (Step 2)
    // Gets : { message }
    const resolutionResult = await resolutionAgent(intentResult, policyResult);

    res.json({
      success: true,
      data: {
        userMessage: message.trim(),
        steps: {
          intent: intentResult,
          policy: policyResult,
          resolution: resolutionResult
        },
        finalMessage: resolutionResult.message
      }
    });

  } catch (error) {
    console.error('Orchestration error:', error.message);

    if (error.status === 401) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key is invalid or not set.'
      });
    }
    if (error.status === 429) {
      return res.status(500).json({
        success: false,
        error: 'Too many requests. Please wait a moment and try again.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Support system encountered an error. Please try again.'
    });
  }
};
