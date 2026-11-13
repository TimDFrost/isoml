import assert from "node:assert/strict";
import test from "node:test";
import { createBrowserSpeechInput } from "./speech-input.ts";

test("speech input reports unsupported outside browser", async () => {
  const service = createBrowserSpeechInput();
  assert.equal(service.supported, false);
  const result = await service.start();
  assert.equal(result.supported, false);
  assert.match(result.error || "", /unavailable/i);
});
