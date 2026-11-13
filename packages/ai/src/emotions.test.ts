import assert from "node:assert/strict";
import test from "node:test";
import { DR_YABLES_EMOTIONS, inferEmotionFromReply, nextEmotion } from "./index.js";

test("emotion catalog includes required interview states", () => {
  for (const required of [
    "idle",
    "greeting",
    "listening",
    "thinking",
    "speaking",
    "amused",
    "curious",
    "surprised",
    "celebrating",
    "resting",
  ]) {
    assert.ok(DR_YABLES_EMOTIONS.includes(required as never));
  }
});

test("inferEmotionFromReply maps celebration and curiosity", () => {
  assert.equal(inferEmotionFromReply("Congratulations! What next?"), "celebrating");
  assert.equal(inferEmotionFromReply("I'm curious about that."), "curious");
});

test("nextEmotion replaces current state", () => {
  assert.equal(nextEmotion("idle", "listening"), "listening");
});
