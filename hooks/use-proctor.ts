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

    // 1. Tab switch & visibility change
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

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, triggerViolation]);

  const clearWarning = () => setWarningMessage(null);

  return { violations, warningMessage, clearWarning };
}
