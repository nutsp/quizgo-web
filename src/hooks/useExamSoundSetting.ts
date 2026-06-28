"use client";

import { useCallback, useEffect, useState } from "react";

export const EXAM_SOUND_ENABLED_KEY = "exam-sound-enabled";

export function useExamSoundSetting() {
  const [enabled, setEnabledState] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem(EXAM_SOUND_ENABLED_KEY);
    if (saved !== null) {
      setEnabledState(saved === "true");
    }
  }, []);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    window.localStorage.setItem(EXAM_SOUND_ENABLED_KEY, String(next));
  }, []);

  return { enabled, setEnabled };
}
