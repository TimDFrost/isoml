export type SpeechInputResult = {
  transcript: string;
  supported: boolean;
  error?: string;
};

type RecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getRecognitionCtor(): (new () => RecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => RecognitionLike;
    webkitSpeechRecognition?: new () => RecognitionLike;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export type SpeechInputService = {
  supported: boolean;
  start: () => Promise<SpeechInputResult>;
  stop: () => void;
};

/**
 * Explicit-permission browser speech recognition. Never auto-starts.
 */
export function createBrowserSpeechInput(): SpeechInputService {
  const Ctor = getRecognitionCtor();
  let active: RecognitionLike | null = null;

  return {
    supported: Boolean(Ctor),
    stop: () => {
      active?.abort();
      active = null;
    },
    start: () =>
      new Promise((resolve) => {
        if (!Ctor) {
          resolve({
            transcript: "",
            supported: false,
            error: "Speech recognition is unavailable in this browser. Please type instead.",
          });
          return;
        }
        const recognition = new Ctor();
        active = recognition;
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.continuous = false;
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0]?.transcript || "")
            .join(" ")
            .trim();
          resolve({ transcript, supported: true });
        };
        recognition.onerror = (event) => {
          resolve({
            transcript: "",
            supported: true,
            error:
              event.error === "not-allowed"
                ? "Microphone permission denied. You can still type your answers."
                : `Speech recognition error: ${event.error || "unknown"}`,
          });
        };
        recognition.onend = () => {
          active = null;
        };
        try {
          recognition.start();
        } catch {
          resolve({
            transcript: "",
            supported: true,
            error: "Could not start the microphone. Please type instead.",
          });
        }
      }),
  };
}
