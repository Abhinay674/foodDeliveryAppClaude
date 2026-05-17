/*
 * ──────────────────────────────────────────────────────────────
 * MULTI-AGENT SYSTEM  (Powered by GPT-4.1 — Real AI)
 * ──────────────────────────────────────────────────────────────
 *
 * Each agent = one GPT-4.1 API call with a specific job.
 * All agents return STANDARD JSON so outputs can be passed between them.
 *
 * AGENT 1 — Intent Agent
 *   INPUT : "My order is delayed and I want a refund"  (raw text)
 *   PROMPT: Tell GPT-4.1 to find issueType + requestedAction
 *   OUTPUT: { issueType: "delayed_order", requestedAction: "refund" }
 *
 * AGENT 2 — Policy Agent
 *   INPUT : output of Agent 1
 *   PROMPT: Tell GPT-4.1 the rules → decide if action is allowed
 *   OUTPUT: { actionAllowed: true, actionType: "refund", reason: "..." }
 *
 * AGENT 3 — Resolution Agent
 *   INPUT : output of Agent 1 + Agent 2
 *   PROMPT: Tell GPT-4.1 to write a friendly reply
 *   OUTPUT: { message: "Your refund has been approved." }
 *
 * WHY STANDARD JSON?
 *   Because backend passes output of one agent directly into next agent.
 *   Same structure every time = easy orchestration = scalable system.
 * ──────────────────────────────────────────────────────────────
 */

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Helper: GPT sometimes adds text before/after the JSON.
// This safely extracts ONLY the JSON part from the response.
function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON found in GPT response: ' + text);
  return JSON.parse(match[0]);
}

// ─────────────────────────────────────────────────────────────
// AGENT 1: INTENT AGENT
//
// Job: Understand the customer's message using real AI.
//      GPT-4.1 reads ANY sentence and understands the meaning —
//      no keyword matching needed.
//
// Example input : "My parcel is taking forever, I'm so frustrated"
// GPT understands: issueType = "delayed_order" (even without keyword "delay")
// ─────────────────────────────────────────────────────────────
async function intentAgent(userMessage) {
  const prompt = `You are an Intent Agent for a food delivery customer support system.

Your job: Read the customer message and identify exactly two things:
1. issueType  — must be ONE of: delayed_order, wrong_item, missing_item, payment_issue, other
2. requestedAction — must be ONE of: refund, replacement, cancellation, other

Rules for issueType:
- delayed_order : order is late, not arrived, taking long
- wrong_item    : received wrong food, different item delivered
- missing_item  : item missing from order, incomplete order
- payment_issue : charged twice, wrong amount, payment problem
- other         : anything else

Rules for requestedAction:
- If customer says "refund" or "money back" → refund
- If customer says "replace" or "send again" → replacement
- If customer says "cancel" → cancellation
- If customer doesn't say → infer from issueType (delayed→refund, wrong/missing→replacement)

Return ONLY valid JSON, absolutely no extra text:
{
  "issueType": "",
  "requestedAction": ""
}

Customer Message: "${userMessage}"`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4.1',
    max_tokens: 100,
    temperature: 0,        // temperature 0 = consistent, predictable JSON output
    messages: [{ role: 'user', content: prompt }]
  });

  return extractJSON(response.choices[0].message.content);
}

// ─────────────────────────────────────────────────────────────
// AGENT 2: POLICY AGENT
//
// Job: Check company rules and decide if the requested action is allowed.
//      GPT-4.1 reads the intentResult passed from Agent 1
//      and applies the rules to produce a policy decision.
//
// This agent receives: { issueType, requestedAction }
// This agent returns : { actionAllowed, actionType, reason }
// ─────────────────────────────────────────────────────────────
async function policyAgent(intentResult) {
  const prompt = `You are a Policy Agent for a food delivery customer support system.

Company Rules (apply these exactly):
- delayed_order   → actionAllowed: true,  actionType: "refund",       reason: "Order was delayed beyond acceptable time"
- wrong_item      → actionAllowed: true,  actionType: "replacement",  reason: "Wrong item was delivered to customer"
- missing_item    → actionAllowed: true,  actionType: "replacement",  reason: "Item was missing from the order"
- payment_issue   → actionAllowed: true,  actionType: "refund",       reason: "Payment discrepancy detected"
- other           → actionAllowed: false, actionType: "needs_review", reason: "Issue requires manual review by support team"

Customer Issue (received from Intent Agent):
${JSON.stringify(intentResult, null, 2)}

Apply the rules above and return ONLY valid JSON, no extra text:
{
  "actionAllowed": false,
  "actionType": "",
  "reason": ""
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4.1',
    max_tokens: 100,
    temperature: 0,
    messages: [{ role: 'user', content: prompt }]
  });

  return extractJSON(response.choices[0].message.content);
}

// ─────────────────────────────────────────────────────────────
// AGENT 3: RESOLUTION AGENT
//
// Job: Take results from Agent 1 AND Agent 2 and write
//      a friendly, professional reply for the customer.
//
// This is where the orchestration pays off:
//   - Agent 1 output tells GPT-4.1 WHAT the problem is
//   - Agent 2 output tells GPT-4.1 WHAT action was approved
//   - GPT-4.1 combines both to write the perfect reply
// ─────────────────────────────────────────────────────────────
async function resolutionAgent(intentResult, policyResult) {
  const prompt = `You are a Resolution Agent for a food delivery customer support system.

You have received outputs from two previous agents:

1. Intent Agent Result (what the customer's issue is):
${JSON.stringify(intentResult, null, 2)}

2. Policy Agent Result (what action is approved):
${JSON.stringify(policyResult, null, 2)}

Your job: Write a friendly, empathetic, professional reply to the customer.
- If actionAllowed is true: clearly confirm the approved action (refund/replacement).
- If actionAllowed is false: apologise and say a human agent will review within 24 hours.
- Keep the message to 1-2 sentences. Be warm and reassuring.
- Do NOT mention internal agent names or JSON in the reply.

Return ONLY valid JSON, no extra text:
{
  "message": ""
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4.1',
    max_tokens: 150,
    temperature: 0.3,      // slight creativity for natural-sounding messages
    messages: [{ role: 'user', content: prompt }]
  });

  return extractJSON(response.choices[0].message.content);
}

module.exports = { intentAgent, policyAgent, resolutionAgent };
