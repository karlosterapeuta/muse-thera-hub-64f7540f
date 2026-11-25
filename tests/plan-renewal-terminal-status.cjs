const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const createPayment = fs.readFileSync(path.join(root, "supabase/functions/create-plan-payment/index.ts"), "utf8");
const webhook = fs.readFileSync(path.join(root, "supabase/functions/plan-renewal-webhook/index.ts"), "utf8");

// plan_renewals.status CHECK constraint in production permits only:
// pending, paid, expired, cancelled, failed.
test("refund is persisted using a status accepted by plan_renewals", () => {
  assert.match(createPayment, /status: currentStatus === "cancelled" \? "cancelled" : "failed"/);
  assert.match(webhook, /refunded: 'failed'/);
  assert.doesNotMatch(webhook, /refunded: 'refunded'/);
});

test("provider status is preserved separately for audit/history", () => {
  assert.match(createPayment, /mp_payment_status: currentStatus/);
  assert.match(webhook, /mp_payment_status: paymentStatus/);
});

test("a failed terminal-state update stops creation of another charge", () => {
  assert.match(createPayment, /if \(closeError\)[\s\S]*?return json\([\s\S]*?503\)/);
});
