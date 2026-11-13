export type EntitlementSku =
  | "ai-twin-activation"
  | "reachy-mini-x-you"
  | "nfc-personality-hat"
  | "subscription-monthly";

export type Entitlement = {
  id: string;
  userId: string;
  sku: EntitlementSku;
  source: "stripe-webhook" | "dev-adapter";
  stripeSessionId?: string;
  grantedAt: string;
  active: boolean;
};

export type TransferToken = {
  token: string;
  userId: string;
  profileId: string;
  profileVersion: number;
  expiresAt: string;
  usedAt?: string;
};

const entitlements = new Map<string, Entitlement[]>();
const transferTokens = new Map<string, TransferToken>();

export function grantEntitlement(input: {
  userId: string;
  sku: EntitlementSku;
  source: Entitlement["source"];
  stripeSessionId?: string;
}): Entitlement {
  const entitlement: Entitlement = {
    id: crypto.randomUUID(),
    userId: input.userId,
    sku: input.sku,
    source: input.source,
    stripeSessionId: input.stripeSessionId,
    grantedAt: new Date().toISOString(),
    active: true,
  };
  const existing = entitlements.get(input.userId) ?? [];
  entitlements.set(input.userId, [...existing, entitlement]);
  return entitlement;
}

export function hasActiveEntitlement(
  userId: string,
  sku: EntitlementSku,
): boolean {
  return (entitlements.get(userId) ?? []).some(
    (item) => item.userId === userId && item.sku === sku && item.active,
  );
}

export function listEntitlements(userId: string): Entitlement[] {
  return entitlements.get(userId) ?? [];
}

/** Client redirects are never proof of purchase. */
export function assertPaidImportAllowed(userId: string): void {
  const allowed =
    hasActiveEntitlement(userId, "ai-twin-activation") ||
    hasActiveEntitlement(userId, "reachy-mini-x-you");
  if (!allowed) {
    throw new Error(
      "Commercial profile import requires a verified paid entitlement.",
    );
  }
}

export function mintTransferToken(input: {
  userId: string;
  profileId: string;
  profileVersion: number;
  ttlSeconds?: number;
}): TransferToken {
  assertPaidImportAllowed(input.userId);
  const ttl = input.ttlSeconds ?? 15 * 60;
  const token: TransferToken = {
    token: crypto.randomUUID(),
    userId: input.userId,
    profileId: input.profileId,
    profileVersion: input.profileVersion,
    expiresAt: new Date(Date.now() + ttl * 1000).toISOString(),
  };
  transferTokens.set(token.token, token);
  return token;
}

export function consumeTransferToken(tokenValue: string, userId: string): TransferToken {
  const token = transferTokens.get(tokenValue);
  if (!token) throw new Error("Transfer token not found.");
  if (token.userId !== userId) throw new Error("Transfer token user mismatch.");
  if (token.usedAt) throw new Error("Transfer token already used.");
  if (Date.parse(token.expiresAt) < Date.now()) {
    throw new Error("Transfer token expired.");
  }
  assertPaidImportAllowed(userId);
  const used = { ...token, usedAt: new Date().toISOString() };
  transferTokens.set(tokenValue, used);
  return used;
}

/** Test helper — clears in-memory stores. */
export function __resetBillingStoresForTests(): void {
  entitlements.clear();
  transferTokens.clear();
}
