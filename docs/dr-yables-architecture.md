# Dr. Yables architecture

## Working today

| Layer | Implementation |
| --- | --- |
| 3D avatar | Procedural Reachy Mini–inspired robot via React Three Fiber (`DrYablesAvatar` → lazy `DrYablesCanvas`). Honest 2D fallback when WebGL is unavailable. |
| Emotions | `idle`, `greeting`, `listening`, `thinking`, `speaking`, `amused`, `curious`, `surprised`, `celebrating`, `resting` (+ legacy `happy`). |
| Interview UI | `/interview/[id]` → `InterviewRoom` with transcript, Talk/Type, stop speaking, voice toggle, memory review, finalize + achievement overlay. |
| AI | `POST /api/interview` → `@ohya/ai/conversation` tries Hugging Face Inference Providers (`router.huggingface.co/v1`), then OpenAI, then local demo replies. Credentials stay server-side. |
| Speech | Browser TTS (`speech-output`) and STT (`speech-input`) with captions and mic permission UX. No auto-record; no camera. |
| Persistence | Browser `localStorage` journey v2: sessions, messages, memory candidates (pending/approved/rejected), profile draft. |
| Memory ethics | Candidate insights require explicit approve/reject. Only approved notes enter prompts and profile rebuilds. |
| Commerce boundary | Yables stays free. Profile transfer / twin activation remains on isoML behind auth + entitlement + consent. |

## Placeholders / needs credentials or assets

- Official GLB rig + brand logos (procedural avatar / placeholder art in use).
- Live HF or OpenAI keys for non-fallback conversation (`HF_TOKEN` / `OPENAI_API_KEY`).
- Postgres + private object storage (schema intent documented; MVP uses localStorage).
- Production TTS/STT provider (swap behind speech service interfaces).
- Reachy Mini physical adapter (contract only — see below).

## Module map

```
DrYablesAvatar / DrYablesCanvas / AvatarExpressionController
SpeechOutputService / SpeechInputService
InterviewRoom → InterviewController logic (in-room)
AIConversationService → packages/ai conversation + /api/interview
SessionManager / PersonalityMemoryService → journey-storage
ProfileReview / AchievementOverlay
AvatarBehavior → web adapter (+ future Reachy Mini)
```

## Env

See `apps/yables/.env.example`.
