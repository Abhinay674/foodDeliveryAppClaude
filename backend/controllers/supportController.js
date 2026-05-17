/*
 * HOW THIS FILE WORKS (simple explanation):
 *
 * This is the ORCHESTRATOR — it runs the 3 agents in order:
 *
 *   Step 1: Call intentAgent(userMessage)     → get intentResult
 *   Step 2: Call policyAgent(intentResult)    → get policyResult
 *   Step 3: Call resolutionAgent(intentResult, policyResult) → get final message
 *
 * Then return ALL results to the frontend so the user can see each step.
 *
 * This is the "brain" that coordinates the agents.
 * Each agent does ONE job. This controller connects them.
 */

const { intentAgent, policyAgent, resolutionAgent } = require('../services/agentService');

exports.resolveIssue = async (req, res) => {
  const { message } = req.body;

  // Validate input
  if (!message || message.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Please provide a message describing your issue.'
    });
  }

  try {
    // ── STEP 1: Intent Agent ──────────────────────────────
    // Send user's raw message → get structured issue info
    // Output example: { issueType: "delayed_order", requestedAction: "refund" }
    const intentResult = await intentAgent(message.trim());

    // ── STEP 2: Policy Agent ──────────────────────────────
    // Send intentResult → check if action is allowed by company rules
    // Output example: { actionAllowed: true, actionType: "refund", reason: "Order delayed" }
    const policyResult = await policyAgent(intentResult);

    // ── STEP 3: Resolution Agent ──────────────────────────
    // Send BOTH intentResult + policyResult → generate final customer reply
    // Output example: { message: "Your refund has been approved." }
    const resolutionResult = await resolutionAgent(intentResult, policyResult);

    // Return everything: the final message + all intermediate steps
    // We return steps so frontend can show the user HOW the decision was made
    res.json({
      success: true,
      data: {
        userMessage: message.trim(),
        steps: {
          // Step 1 result: what the AI understood
          intent: intentResult,
          // Step 2 result: what the policy says
          policy: policyResult,
          // Step 3 result: the final reply
          resolution: resolutionResult
        },
        // The final message to show the customer
        finalMessage: resolutionResult.message
      }
    });

  } catch (error) {
    console.error('Agent orchestration error:', error.message);

    // Handle missing API key specifically
    if (error.message.includes('API key') || error.status === 401) {
      return res.status(500).json({
        success: false,
        error: 'Anthropic API key not configured. Please set ANTHROPIC_API_KEY.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Support system encountered an error. Please try again.'
    });
  }
};
