"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createDefaultStudioState,
  loadStudioState,
  resetStudioState,
  saveStudioState,
} from "@/lib/studio-storage";
import type { StudioState } from "@/lib/types";

type StudioContextValue = {
  ready: boolean;
  state: StudioState;
  setState: (updater: StudioState | ((prev: StudioState) => StudioState)) => void;
  persist: () => void;
  reset: () => void;
  status: string;
  setStatus: (value: string) => void;
};

const StudioContext = createContext<StudioContextValue | null>(null);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setStateInternal] = useState<StudioState>(createDefaultStudioState());
  const [status, setStatus] = useState("");

  useEffect(() => {
    setStateInternal(loadStudioState());
    setReady(true);
  }, []);

  const setState = useCallback(
    (updater: StudioState | ((prev: StudioState) => StudioState)) => {
      setStateInternal((prev) =>
        typeof updater === "function" ? updater(prev) : updater,
      );
    },
    [],
  );

  const persist = useCallback(() => {
    setStateInternal((prev) => {
      const next = saveStudioState(prev);
      setStatus("Studio draft saved locally in this browser.");
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const next = resetStudioState();
    setStateInternal(next);
    setStatus("Studio reset to empty preview state.");
  }, []);

  const value = useMemo(
    () => ({ ready, state, setState, persist, reset, status, setStatus }),
    [ready, state, setState, persist, reset, status],
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const value = useContext(StudioContext);
  if (!value) throw new Error("useStudio must be used within StudioProvider");
  return value;
}
