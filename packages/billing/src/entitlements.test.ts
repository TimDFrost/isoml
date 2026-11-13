import assert from "node:assert/strict";
import test from "node:test";
import {
  __resetBillingStoresForTests,
  assertPaidImportAllowed,
  consumeTransferToken,
  grantEntitlement,
  mintTransferToken,
} from "./index.js";

test("unpaid users cannot import commercially", () => {
  __resetBillingStoresForTests();
  assert.throws(() => assertPaidImportAllowed("u1"), /paid entitlement/);
});

test("verified entitlement unlocks single-use transfer token", () => {
  __resetBillingStoresForTests();
  grantEntitlement({
    userId: "u1",
    sku: "ai-twin-activation",
    source: "stripe-webhook",
    stripeSessionId: "cs_test_1",
  });
  const token = mintTransferToken({
    userId: "u1",
    profileId: "p1",
    profileVersion: 3,
  });
  const consumed = consumeTransferToken(token.token, "u1");
  assert.equal(consumed.profileVersion, 3);
  assert.throws(() => consumeTransferToken(token.token, "u1"), /already used/);
});

test("browser redirect alone cannot mint a transfer token", () => {
  __resetBillingStoresForTests();
  assert.throws(
    () =>
      mintTransferToken({
        userId: "u2",
        profileId: "p2",
        profileVersion: 1,
      }),
    /paid entitlement/,
  );
});
