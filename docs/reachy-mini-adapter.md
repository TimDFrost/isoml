# Future Reachy Mini adapter notes

The browser avatar and a physical Reachy Mini should share the same conversational personality service (`@ohya/ai`) while keeping separate motion systems.

## Shared contract (`AvatarBehavior`)

Defined in `@ohya/ai`:

- `speak(text)`
- `listen()`
- `setEmotion(emotion)`
- `lookAt(target)`
- `celebrate()`
- `stop()`

Web implementation: `apps/yables/lib/avatar-behavior.ts` → `createWebAvatarBehavior`.

## Reachy Mini adapter (planned)

1. Read official docs before coding robot motion:
   - https://huggingface.co/docs/reachy_mini/
   - https://github.com/pollen-robotics/reachy_mini/blob/main/AGENTS.md
2. Implement `createReachyMiniBehavior()` that maps the same methods onto the **official JavaScript SDK** only.
3. Do **not** invent unsupported joint/face APIs. Prefer documented head pose, antenna, and face-display helpers from the SDK.
4. Keep customer memory databases private. Hugging Face is for model inference and optional robot-app distribution — never a default public store for personal profiles.
5. Physical deployment and commercial twin hosting remain isoML concerns after verified payment entitlement and explicit transfer consent.

## Separation of concerns

| Concern | Owner |
| --- | --- |
| Interview prompts, safety, approved memory | `@ohya/ai` |
| Web rendering / TTS / STT | Yables web app |
| Robot actuators / face screen | Reachy Mini SDK adapter |
| Paid twin + hardware commerce | isoML |
