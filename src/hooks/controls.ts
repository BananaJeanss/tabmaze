import { createElement, useCallback, useEffect } from "react";
import { createRoot } from "react-dom/client";
import MobileControls, {
  type MobileControlsProps,
} from "../components/MobileControls";
import PlayBeep from "./beeper";

export default function useControls(columns: number) {
  // if el chapo wants to play on mobile we give the mf mobile controls this is 2025
  useEffect(() => {
    const isMobileElNoKeyboard =
      /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

    console.log("is mobile:", isMobileElNoKeyboard);

    if (isMobileElNoKeyboard) {
      const mobileControlsProps: MobileControlsProps = {
        keyPressed(key) {
          // either Tab, ShiftTab, CapsLock, Ctrl
          const keyboardEvent = new KeyboardEvent("keydown", {
            key: key === "ShiftTab" ? "Tab" : key === "Ctrl" ? "Control" : key,
            shiftKey: key === "ShiftTab",
            ctrlKey: key === "Ctrl",
            bubbles: true,
          });
          window.dispatchEvent(keyboardEvent);
        },
      };

      const mobileControlsElement = document.createElement("div");
      mobileControlsElement.id = "mobile-controls-root";
      mobileControlsElement.style.cssText =
        "position: fixed; bottom: 0; left: 0; z-index: 9999; pointer-events: auto;";
      document.body.appendChild(mobileControlsElement);

      const root = createRoot(mobileControlsElement);
      root.render(createElement(MobileControls, mobileControlsProps));

      return () => {
        root.unmount();
        document.body.removeChild(mobileControlsElement);
      };
    }
  }, []);

  // move handler
  const moveFocusToButtonAtIndex: (index: number) => void = useCallback(
    (index: number) => {
      const allButtons = Array.from(
        document.querySelectorAll("#root button")
      ) as HTMLButtonElement[];
      if (index >= 0 && index < allButtons.length) {
        const button = allButtons[index];
        if (button && button.hasAttribute("data-portal")) {
          const to = button.getAttribute("data-portal-to"); // "row,col"
          if (to) {
            const [toRow, toCol] = to.split(",").map((n) => Number(n));
            const targetIndex = toRow * columns + toCol;
            const target = allButtons[targetIndex];

            // avoid focusing walls/disabled buttons (they won't take focus anyway)
            if (
              target &&
              !target.hasAttribute("data-wall") &&
              !target.disabled
            ) {
              target.focus();
              PlayBeep(0.1, 550, 0.2);
              setTimeout(() => {
                PlayBeep(0.1, 660, 0.3);
              }, 100);
              return;
            }
          }
          // if parsing fails / target invalid, fall through to normal behavior
        }
        if (button && button.hasAttribute("data-evil")) {
          // evil tile sound
          PlayBeep(0.3, 110, 0.3);
          setTimeout(() => {
            PlayBeep(0.3, 55, 0.3);
          }, 300);
          const allButtons = Array.from(
            document.querySelectorAll("button")
          ) as HTMLButtonElement[];
          const firstNonWall = allButtons.find(
            (btn) => !btn.hasAttribute("data-wall")
          );
          if (firstNonWall) {
            firstNonWall.focus();
          }
          // evil tiles are evil
          return;
        }
        if (button && !button.hasAttribute("data-wall") && !button.disabled) {
          button.focus();
          PlayBeep(0.1, 440, 0.1); // normal button sound
        }
      }
    },
    [columns]
  );

  // block default tab/shift tab functionality
  useEffect(() => {
    const HandleTabMySelf = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const focusedElement = document.activeElement as HTMLElement;

        const allButtons = Array.from(
          document.querySelectorAll("#root button")
        ) as HTMLButtonElement[];

        if (!focusedElement || focusedElement.tagName !== "BUTTON") {
          const firstNonWall = allButtons.find(
            (btn) => !btn.hasAttribute("data-wall")
          );
          firstNonWall?.focus();
          return;
        }

        const currentIndex = allButtons.indexOf(
          focusedElement as HTMLButtonElement
        );

        const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;

        moveFocusToButtonAtIndex(nextIndex);
      }
    };

    // add event listener
    window.addEventListener("keydown", HandleTabMySelf);
    return () => window.removeEventListener("keydown", HandleTabMySelf);
  }, [columns, moveFocusToButtonAtIndex]);

  // r is for refresh cause we disabled ctrl
  useEffect(() => {
    let refreshTimer: number | null = null;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "r" && !refreshTimer) {
        refreshTimer = window.setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "r" && refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (refreshTimer) clearTimeout(refreshTimer);
    };
  }, []);

  // on CapsLk or Ctrl, move up/down a row on the same column
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "CapsLock" || e.key === "Control") {
        e.preventDefault();
        const focusedElement = document.activeElement as HTMLElement;
        if (focusedElement && focusedElement.tagName === "BUTTON") {
          const buttons = Array.from(
            document.querySelectorAll("#root button")
          ) as HTMLButtonElement[];
          const currentIndex = buttons.indexOf(
            focusedElement as HTMLButtonElement
          );
          let newIndex = -1;

          if (e.key === "CapsLock") {
            newIndex = currentIndex - columns; // Move up
          } else if (e.key === "Control") {
            newIndex = currentIndex + columns; // Move down
          }

          moveFocusToButtonAtIndex(newIndex);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [columns, moveFocusToButtonAtIndex]);
}
