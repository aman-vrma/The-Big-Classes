import { useEffect, useState, useCallback } from "react";

interface ProctorOptions {
  maxViolations?: number;
  onAutoSubmit?: () => void;
  enabled?: boolean;
}

export function useProctor({ maxViolations = 3, onAutoSubmit, enabled = false }: ProctorOptions) {
  const [violations, setViolations] = useState(0);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const triggerViolation = useCallback((reason: string) => {
    if (!enabled) return;

    setViolations((prev) => {
      const next = prev + 1;
      setWarningMessage(`Warning ${next}/${maxViolations}: ${reason}`);

      if (next >= maxViolations) {
        if (onAutoSubmit) onAutoSubmit();
      }
      return next;
    });
  }, [enabled, maxViolations, onAutoSubmit]);

  useEffect(() => {
    if (!enabled) return;

    // 1. Tab switch & minimization (this event only ever fires on `document`, not `window`)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation("Tab switch or minimization detected!");
      }
    };

    // 2. Window blur (Alt+Tab, clicking outside)
    const handleWindowBlur = () => {
      triggerViolation("Window lost focus! Stay on the test screen.");
    };

    // 3. Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 4. Disable copy/paste & inspect shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && ["c", "v", "x", "a", "u", "s"].includes(e.key.toLowerCase())) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        triggerViolation("Unauthorized shortcut attempt blocked!");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, triggerViolation]);

  const clearWarning = () => setWarningMessage(null);

  // Lets the caller start a fresh attempt (e.g. a new exam) at 0 strikes instead of
  // carrying over violations from a previous attempt in the same session.
  const resetViolations = useCallback(() => {
    setViolations(0);
    setWarningMessage(null);
  }, []);

  return { violations, warningMessage, clearWarning, resetViolations };
}