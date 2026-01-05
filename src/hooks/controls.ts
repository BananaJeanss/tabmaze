import { useEffect } from "react";

export default function useControls(columns: number) {
      // block default tab/shift tab functionality
  useEffect(() => {
    const HandleTabMySelf = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const focusedElement = document.activeElement as HTMLElement;

        // Get all buttons
        const allButtons = Array.from(
          document.querySelectorAll("button")
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

  // on CapsLk or Ctrl, move up/down a row on the same column
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "CapsLock" || e.ctrlKey) {
        const focusedElement = document.activeElement as HTMLElement;
        if (focusedElement && focusedElement.tagName === "BUTTON") {
          const buttons = Array.from(
            document.querySelectorAll("button")
          ) as HTMLButtonElement[];
          const currentIndex = buttons.indexOf(
            focusedElement as HTMLButtonElement
          );
          let newIndex = -1;

          if (e.key === "CapsLock") {
            newIndex = currentIndex - columns; // Move up
          } else if (e.ctrlKey) {
            newIndex = currentIndex + columns; // Move down
          }

          if (newIndex >= 0 && newIndex < buttons.length) {
            (buttons[newIndex] as HTMLElement).focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [columns]);
}