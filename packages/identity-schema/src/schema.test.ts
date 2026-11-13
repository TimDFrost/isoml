import assert from "node:assert/strict";
import test from "node:test";
import { YABLES_SESSIONS, emptyProfile } from "./index.js";

test("Yables defines twelve sessions across three acts", () => {
  assert.equal(YABLES_SESSIONS.length, 12);
  assert.deepEqual(
    YABLES_SESSIONS.map((s) => s.act),
    [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3],
  );
});

test("empty profile starts with no completed sessions", () => {
  const profile = emptyProfile("user-1", "Alex");
  assert.equal(profile.displayName, "Alex");
  assert.equal(profile.completedSessions.length, 0);
  assert.ok(profile.aiInstructions.length > 0);
});
