/*
 * ──────────────────────────────────────────────────────────────
 * MULTI-AGENT SYSTEM  (Rule-Based — No API Key Required)
 * ──────────────────────────────────────────────────────────────
 *
 * 3 agents work in sequence. Each agent:
 *   1. Receives input (JSON)
 *   2. Does its job
 *   3. Returns STANDARD JSON output
 *   4. Output is passed to the next agent
 *
 * AGENT 1 — Intent Agent
 *   INPUT : "My order is delayed and I want a refund"   (raw text)
 *   JOB   : Understand what the problem is + what user wants
 *   OUTPUT: { issueType: "delayed_order", requestedAction: "refund" }
 *
 * AGENT 2 — Policy Agent
 *   INPUT : { issueType: "delayed_order", requestedAction: "refund" }
 *   JOB   : Check company rules → is this action allowed?
 *   OUTPUT: { actionAllowed: true, actionType: "refund", reason: "..." }
 *
 * AGENT 3 — Resolution Agent
 *   INPUT : output of Agent 1 + output of Agent 2
 *   JOB   : Generate final friendly reply for customer
 *   OUTPUT: { message: "Your refund has been approved." }
 * ──────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────
// AGENT 1: INTENT AGENT
// How it works: scan the user's message for keywords
//   → match keywords to known issue types and actions
// ─────────────────────────────────────────────────────────────
function intentAgent(userMessage) {
  const msg = userMessage.toLowerCase();

  // ── Step A: Detect the issue type ──────────────────────────
  // We check keywords in order of priority
  let issueType = 'other'; // default if nothing matches

  if (msg.includes('delay') || msg.includes('late') || msg.includes('not arrived') ||
      msg.includes('waiting') || msg.includes('not delivered') || msg.includes('taking long')) {
    issueType = 'delayed_order';

  } else if (msg.includes('wrong') || msg.includes('different') || msg.includes('instead') ||
             msg.includes('incorrect') || msg.includes('not what i ordered') ||
             msg.includes('received') || msg.includes('delivered wrong') ||
             (msg.includes('ordered') && (msg.includes('got') || msg.includes('received') || msg.includes('but')))) {
    issueType = 'wrong_item';

  } else if (msg.includes('missing') || msg.includes('not received') || msg.includes('incomplete') ||
             msg.includes('did not receive') || msg.includes('not in bag') || msg.includes('left out')) {
    issueType = 'missing_item';

  } else if (msg.includes('charged') || msg.includes('payment') || msg.includes('double') ||
             msg.includes('overcharged') || msg.includes('extra charge') || msg.includes('billed') ||
             msg.includes('deducted') || msg.includes('twice')) {
    issueType = 'payment_issue';
  }

  // ── Step B: Detect what action the user wants ──────────────
  let requestedAction = 'other'; // default

  if (msg.includes('refund') || msg.includes('money back') || msg.includes('return money') ||
      msg.includes('get my money') || msg.includes('reimburse')) {
    requestedAction = 'refund';

  } else if (msg.includes('replace') || msg.includes('replacement') || msg.includes('resend') ||
             msg.includes('send again') || msg.includes('new order') || msg.includes('another')) {
    requestedAction = 'replacement';

  } else if (msg.includes('cancel') || msg.includes('cancellation')) {
    requestedAction = 'cancellation';

  } else {
    // If user didn't say what they want, INFER it from the issue type
    // (this is smart default behaviour)
    if (issueType === 'delayed_order')  requestedAction = 'refund';
    if (issueType === 'payment_issue')  requestedAction = 'refund';
    if (issueType === 'wrong_item')     requestedAction = 'replacement';
    if (issueType === 'missing_item')   requestedAction = 'replacement';
  }

  // Return standard JSON — same structure every time
  return { issueType, requestedAction };
}

// ─────────────────────────────────────────────────────────────
// AGENT 2: POLICY AGENT
// How it works: look up the issueType in the rules table
//   → return what action is allowed
//
// RULES TABLE:
//   delayed_order  → refund allowed
//   wrong_item     → replacement allowed
//   missing_item   → replacement allowed
//   payment_issue  → refund allowed
//   other          → needs manual review
// ─────────────────────────────────────────────────────────────
function policyAgent(intentResult) {
  const { issueType } = intentResult;

  // All rules in one place — easy to update later
  const POLICY_RULES = {
    delayed_order: {
      actionAllowed: true,
      actionType: 'refund',
      reason: 'Order was delayed beyond acceptable delivery time'
    },
    wrong_item: {
      actionAllowed: true,
      actionType: 'replacement',
      reason: 'Wrong item was delivered to customer'
    },
    missing_item: {
      actionAllowed: true,
      actionType: 'replacement',
      reason: 'Item was missing from the order'
    },
    payment_issue: {
      actionAllowed: true,
      actionType: 'refund',
      reason: 'Payment discrepancy detected in customer account'
    },
    other: {
      actionAllowed: false,
      actionType: 'needs_review',
      reason: 'Issue requires manual review by support team'
    }
  };

  // Look up the rule — if issue type not found, use 'other'
  const rule = POLICY_RULES[issueType] || POLICY_RULES['other'];

  // Return standard JSON — same structure every time
  return {
    actionAllowed: rule.actionAllowed,
    actionType: rule.actionType,
    reason: rule.reason
  };
}

// ─────────────────────────────────────────────────────────────
// AGENT 3: RESOLUTION AGENT
// How it works: combine intentResult + policyResult
//   → pick the right message template
//   → return final customer-facing message
// ─────────────────────────────────────────────────────────────
function resolutionAgent(intentResult, policyResult) {
  const { issueType } = intentResult;
  const { actionAllowed, actionType } = policyResult;

  // If policy says action is NOT allowed → escalate to human
  if (!actionAllowed) {
    return {
      message: "We're sorry about your experience. Your case has been escalated to our support team who will review and get back to you within 24 hours."
    };
  }

  // Message templates for each scenario
  // Organised as: MESSAGES[actionType][issueType]
  const MESSAGES = {
    refund: {
      delayed_order: "We sincerely apologise for the delay! Your full refund has been approved and will be credited to your account within 3–5 business days.",
      payment_issue: "We've identified the payment issue. Your refund has been processed and will reflect in your account within 3–5 business days.",
      default:       "Your refund request has been approved and will be credited to your account within 3–5 business days."
    },
    replacement: {
      wrong_item:   "We're sorry you received the wrong item! A replacement order has been initiated and will be delivered to you at no extra charge.",
      missing_item: "We apologise for the missing item! A replacement has been dispatched and will reach you as soon as possible.",
      default:      "Your replacement order has been initiated and will be delivered to you shortly."
    },
    cancellation: {
      default: "Your order cancellation has been processed successfully. Any applicable refund will be credited within 3–5 business days."
    },
    needs_review: {
      default: "Your case has been reviewed. Our support team will contact you within 24 hours with a resolution."
    }
  };

  // Pick the right message:
  // First try specific message for this issue type,
  // then fall back to the default for this action type
  const actionMessages = MESSAGES[actionType] || MESSAGES['needs_review'];
  const message = actionMessages[issueType] || actionMessages['default'];

  // Return standard JSON — same structure every time
  return { message };
}

module.exports = { intentAgent, policyAgent, resolutionAgent };
