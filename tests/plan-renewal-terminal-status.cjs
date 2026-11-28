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


test("pending renewal can be resumed using the payment fetched from Mercado Pago", () => {
  assert.match(createPayment, /body\?\.action === "resume"/);
  assert.match(createPayment, /pointOfInteraction:/);
  assert.match(createPayment, /transaction_data\.qr_code/);
  assert.match(createPayment, /eq\("user_id", user\.id\)/);
});

test("replacing a pending renewal cancels it with Mercado Pago before another charge", () => {
  assert.match(createPayment, /body\?\.action === "cancel-pending"/);
  assert.match(createPayment, /method: "PUT"/);
  assert.match(createPayment, /JSON\.stringify\(\{ status: "cancelled" \}\)/);
  assert.match(createPayment, /cancelledPayment\.status/);
  assert.match(createPayment, /status: "cancelled", mp_payment_status: "cancelled"/);
  assert.match(createPayment, /approved/);
});

test("plan page offers resuming the previous payment and selecting another plan", () => {
  const page = fs.readFileSync(path.join(root, "src/pages/PlanRenewal.tsx"), "utf8");
  assert.match(page, /Continuar pagamento anterior/);
  assert.match(page, /cancel-pending/);
  assert.match(page, /window\.confirm/);
  assert.doesNotMatch(page, /disabled=\{hasPendingRenewal\}/);
});
