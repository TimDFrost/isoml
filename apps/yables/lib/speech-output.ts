export type SpeechOutputEvents = {
  onStart?: () => void;
  onEnd?: () => void;
  onBoundary?: (charIndex: number) => void;
  onError?: (message: string) => void;
};

export type SpeechOutputService = {
  supported: boolean;
  speak: (text: string, events?: SpeechOutputEvents) => Promise<void>;
  stop: () => void;
  setEnabled: (enabled: boolean) => void;
  isEnabled: () => boolean;
};

/**
 * Browser speech synthesis adapter. Swap later for a production TTS provider
 * without changing interview UI code.
 */
export function createBrowserSpeechOutput(): SpeechOutputService {
  let enabled = true;
  const supported =
    typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined";

  const pickVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => /en(-|_)US/i.test(v.lang) && /male|daniel|alex|fred/i.test(v.name)) ||
      voices.find((v) => /en/i.test(v.lang)) ||
      voices[0]
    );
  };

  return {
    supported,
    isEnabled: () => enabled,
    setEnabled: (value) => {
      enabled = value;
      if (!value && supported) window.speechSynthesis.cancel();
    },
    stop: () => {
      if (supported) window.speechSynthesis.cancel();
    },
    speak: (text, events) =>
      new Promise((resolve) => {
        if (!supported || !enabled || !text.trim()) {
          resolve();
          return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.replace(/\(Local demonstration reply[\s\S]*$/, "").trim());
        const voice = pickVoice();
        if (voice) utterance.voice = voice;
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.onstart = () => events?.onStart?.();
        utterance.onend = () => {
          events?.onEnd?.();
          resolve();
        };
        utterance.onerror = () => {
          events?.onError?.("Speech synthesis failed.");
          resolve();
        };
        utterance.onboundary = (event) => events?.onBoundary?.(event.charIndex);
        window.speechSynthesis.speak(utterance);
      }),
  };
}
