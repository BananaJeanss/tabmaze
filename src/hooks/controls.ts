import { createElement, useEffect } from "react";
import { createRoot } from "react-dom/client";
import MobileControls, {
  type MobileControlsProps,
} from "../components/MobileControls";

export default function useControls(columns: number) {
  // if el chapo wants to play on mobile we give the mf mobile controls this is 2025
  useEffect(() => {
    const isMobileElNoKeyboard = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

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
      mobileControlsElement.style.cssText = "position: fixed; bottom: 0; left: 0; z-index: 9999; pointer-events: auto;";
      document.body.appendChild(mobileControlsElement);
      
      const root = createRoot(mobileControlsElement);
      root.render(createElement(MobileControls, mobileControlsProps));

      return () => {
        root.unmount();
        document.body.removeChild(mobileControlsElement);
      };
    }
  }, []);

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
          // focus on first non-wall button if none focused
          const firstNonWall = allButtons.find(
            (btn) => !btn.hasAttribute("data-wall")
          );
          firstNonWall?.focus();
          return;
        }

        const currentIndex = allButtons.indexOf(
          focusedElement as HTMLButtonElement
        );

        let nextIndex: number;
        if (e.shiftKey) {
          nextIndex = currentIndex - 1; // Moving backwards
        } else {
          nextIndex = currentIndex + 1; // Moving forwards
        }

        if (nextIndex >= 0 && nextIndex < allButtons.length) {
          const nextButton = allButtons[nextIndex];
          if (!nextButton.hasAttribute("data-wall")) {
            nextButton.focus();
          }
        }
      }
    };

    // add event listener
    window.addEventListener("keydown", HandleTabMySelf);
    return () => window.removeEventListener("keydown", HandleTabMySelf);
  }, []);

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

          if (newIndex >= 0 && newIndex < buttons.length) {
            (buttons[newIndex] as HTMLElement).focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [columns]);
}
