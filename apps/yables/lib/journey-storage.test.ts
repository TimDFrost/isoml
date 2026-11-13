import assert from "node:assert/strict";
import test from "node:test";
import {
  approvedNotes,
  createDefaultJourney,
  setMemoryStatus,
  unlockNext,
} from "./journey-storage.ts";

test("default journey opens only session 1", () => {
  const journey = createDefaultJourney();
  assert.equal(journey.sessions[0]?.status, "open");
  assert.equal(journey.sessions[1]?.status, "locked");
  assert.equal(journey.memoryCandidates.length, 0);
});

test("unlockNext completes session and opens the next", () => {
  const unlocked = unlockNext(createDefaultJourney(), 1);
  assert.equal(unlocked.sessions[0]?.status, "completed");
  assert.equal(unlocked.sessions[1]?.status, "open");
  assert.ok(unlocked.sessions[0]?.badge);
});

test("approvedNotes only returns approved candidates", () => {
  let journey = createDefaultJourney();
  journey = {
    ...journey,
    memoryCandidates: [
      {
        id: "a",
        sessionId: 1,
        text: "likes quiet mornings",
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      {
        id: "b",
        sessionId: 1,
        text: "designs logos",
        status: "approved",
        createdAt: new Date().toISOString(),
      },
    ],
  };
  assert.deepEqual(approvedNotes(journey), ["designs logos"]);
  journey = setMemoryStatus(journey, "a", "rejected");
  assert.equal(journey.memoryCandidates.find((i) => i.id === "a")?.status, "rejected");
});
