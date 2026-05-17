/*
 * HOW THIS FILE WORKS (simple explanation):
 *
 * This file has 3 functions, each is one "agent".
 * Each agent = one Claude API call with a specific job.
 *
 * Agent 1 - intentAgent:
 *   INPUT:  "My order is delayed and I want refund"   ← user's raw message
 *   OUTPUT: { issueType: "delayed_order", requestedAction: "refund" }
 *
 * Agent 2 - policyAgent:
 *   INPUT:  { issueType: "delayed_order", requestedAction: "refund" }  ← from Agent 1
 *   OUTPUT: { actionAllowed: true, actionType: "refund", reason: "Order delayed" }
 *
 * Agent 3 - resolutionAgent:
 *   INPUT:  result from Agent 1 + result from Agent 2
 *   OUTPUT: { message: "Your refund has been approved." }
 *
 * KEY IDEA: All 3 agents return SAME structure pattern → easy to pass between them.
 */

const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Helper: Claude sometimes adds text before/after JSON.
// This function safely extracts just the JSON part.
function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Agent returned no valid JSON: ' + text);
  return JSON.parse(match[0]);
}

// ─────────────────────────────────────────────
// AGENT 1: INTENT AGENT
// Job: Read the user's message → find out:
//   (a) what went wrong  → issueType
//   (b) what user wants  → requestedAction
// ─────────────────────────────────────────────
async function intentAgent(userMessage) {
  const prompt = `You are an Intent Agent for a food delivery support system.

Your job: Read the customer message and identify:
1. issueType  → one of: delayed_order, wrong_item, missing_item, payment_issue, other
2. requestedAction → one of: refund, replacement, cancellation, other

Return ONLY valid JSON, no extra text:

{
  "issueType": "",
  "requestedAction": ""
}

Customer Message: "${userMessage}"`;

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    messages: [{ role: 'user', content: prompt }]
  });

  return extractJSON(response.content[0].text);
}

// ─────────────────────────────────────────────
// AGENT 2: POLICY AGENT
// Job: Check company rules → decide if action is allowed
//
// RULES:
//   delayed_order   → refund allowed
//   wrong_item      → replacement allowed
//   missing_item    → replacement allowed
//   payment_issue   → refund allowed
//   other           → needs_review (not allowed automatically)
//
// Always returns SAME structure:
//   { actionAllowed, actionType, reason }
// ─────────────────────────────────────────────
async function policyAgent(intentResult) {
  const prompt = `You are a Policy Agent for a food delivery support system.

Company Rules:
- delayed_order   → refund is allowed
- wrong_item      → replacement is allowed
- missing_item    → replacement is allowed
- payment_issue   → refund is allowed
- other           → not allowed automatically, set actionAllowed: false, actionType: "needs_review"

Customer Issue (from Intent Agent):
${JSON.stringify(intentResult, null, 2)}

Based on the rules, decide what action is allowed.

Return ONLY valid JSON, no extra text:

{
  "actionAllowed": false,
  "actionType": "",
  "reason": ""
}`;

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    messages: [{ role: 'user', content: prompt }]
  });

  return extractJSON(response.content[0].text);
}

// ─────────────────────────────────────────────
// AGENT 3: RESOLUTION AGENT
// Job: Take results from Agent 1 + Agent 2
//      → write a friendly final reply to the customer
//
// This agent sees the full picture:
//   - what the customer's issue is (from intentAgent)
//   - what action is allowed (from policyAgent)
// Then writes one clear message for the customer.
// ─────────────────────────────────────────────
async function resolutionAgent(intentResult, policyResult) {
  const prompt = `You are a Resolution Agent for a food delivery support system.

You have two pieces of information:

1. Customer Issue (from Intent Agent):
${JSON.stringify(intentResult, null, 2)}

2. Policy Decision (from Policy Agent):
${JSON.stringify(policyResult, null, 2)}

Write a friendly, professional reply to the customer.
- If actionAllowed is true: confirm the action clearly.
- If actionAllowed is false: apologize and say a human agent will review.
- Keep it short (1-2 sentences).

Return ONLY valid JSON, no extra text:

{
  "message": ""
}`;

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }]
  });

  return extractJSON(response.content[0].text);
}

module.exports = { intentAgent, policyAgent, resolutionAgent };
