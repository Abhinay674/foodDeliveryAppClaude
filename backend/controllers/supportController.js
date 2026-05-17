/*
 * ORCHESTRATOR — runs the 3 agents in order
 *
 * Flow:
 *   user message
 *       ↓
 *   intentAgent(message)          → intentResult
 *       ↓
 *   policyAgent(intentResult)     → policyResult
 *       ↓
 *   resolutionAgent(intentResult, policyResult) → finalMessage
 *       ↓
 *   return all results to frontend
 */

const { intentAgent, policyAgent, resolutionAgent } = require('../services/agentService');

exports.resolveIssue = (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Please provide a message describing your issue.'
    });
  }

  try {
    // STEP 1 — Intent Agent
    // Input : raw user message (string)
    // Output: { issueType, requestedAction }
    const intentResult = intentAgent(message.trim());

    // STEP 2 — Policy Agent
    // Input : intentResult from Step 1
    // Output: { actionAllowed, actionType, reason }
    const policyResult = policyAgent(intentResult);

    // STEP 3 — Resolution Agent
    // Input : intentResult (Step 1) + policyResult (Step 2)
    // Output: { message }
    const resolutionResult = resolutionAgent(intentResult, policyResult);

    // Send everything back to frontend:
    // - finalMessage: what customer sees
    // - steps: all 3 agent outputs (for educational trace view)
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
    res.status(500).json({
      success: false,
      error: 'Support system encountered an error. Please try again.'
    });
  }
};
