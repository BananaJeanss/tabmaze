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

  type MoveDir = "up" | "down" | "left" | "right" | null;

  // move handler
  const moveFocusToButtonAtIndex = useCallback(
    (toIndex: number, fromIndex?: number) => {
      const allButtons = Array.from(
        document.querySelectorAll("#root button")
      ) as HTMLButtonElement[];

      if (toIndex < 0 || toIndex >= allButtons.length) return;

      const button = allButtons[toIndex];
      if (!button) return;

      const attemptedDir: MoveDir = (() => {
        if (typeof fromIndex !== "number") return null;
        const delta = toIndex - fromIndex;
        if (delta === 1) return "right";
        if (delta === -1) return "left";
        if (delta === columns) return "down";
        if (delta === -columns) return "up";
        return null;
      })();

      // handle portal
      if (button.hasAttribute("data-portal")) {
        const to = button.getAttribute("data-portal-to"); // "row,col"
        if (to) {
          const [toRow, toCol] = to.split(",").map((n) => Number(n));
          const targetIndex = toRow * columns + toCol;
          const target = allButtons[targetIndex];

          // avoid focusing walls/disabled buttons (they won't take focus anyway)
          if (target && !target.hasAttribute("data-wall") && !target.disabled) {
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

      // handle evil tiles
      if (
        button.hasAttribute("data-evil") ||
        button.hasAttribute("data-evilIsOnTile")
      ) {
        // evil tile sound
        if (button.hasAttribute("data-evilIsOnTile")) {
          PlayBeep(0.2, 200, 0.2);
          setTimeout(() => {
            PlayBeep(0.2, 100, 0.2);
          }, 200);
        } else {
          PlayBeep(0.3, 110, 0.3);
          setTimeout(() => {
            PlayBeep(0.3, 55, 0.3);
          }, 300);
        }

        const allButtonsAny = Array.from(
          document.querySelectorAll("button")
        ) as HTMLButtonElement[];

        const firstNonWall = allButtonsAny.find(
          (btn) => !btn.hasAttribute("data-wall")
        );
        if (firstNonWall) firstNonWall.focus();

        // evil tiles are evil
        return;
      }

      // oneway tiles: block wrong-direction entry (do NOT auto-push)
      if (button.hasAttribute("data-onewaytile")) {
        const allowed = button.getAttribute("data-onewaydirection") as
          | "up"
          | "down"
          | "left"
          | "right"
          | null;

        if (attemptedDir && allowed && attemptedDir !== allowed) {
          PlayBeep(0.2, 150, 0.2);
          return;
        }
      }

      // handle normal movement
      if (!button.hasAttribute("data-wall") && !button.disabled) {
        button.focus();
        PlayBeep(0.1, 440, 0.1); // normal button sound
      }
    },
    [columns]
  );

  // eviler tiles movement logic
  // data-evilIsOnTile = tile has an eviler on it currently
  // data-evilspawn = tile is an eviler spawn point
  // evilers shouldnt get within the first 3x3 tiles from the start just block
  // evilers move every second to the pathfinding next tile towards the player
  useEffect(() => {
    const interval = setInterval(() => {
      const allButtons = Array.from(
        document.querySelectorAll("#root button")
      ) as HTMLButtonElement[];

      const evilers = allButtons.filter((btn) =>
        btn.hasAttribute("data-evilIsOnTile")
      );

      const playerButton = document.activeElement as HTMLButtonElement;

      if (!playerButton) return;

      const playerIndex = allButtons.indexOf(playerButton);
      const playerRow = Math.floor(playerIndex / columns);
      const playerCol = playerIndex % columns;

      evilers.forEach((eviler) => {
        const evilerIndex = allButtons.indexOf(eviler);
        const evilerRow = Math.floor(evilerIndex / columns);
        const evilerCol = evilerIndex % columns;

        // if already within 3x3, teleport away
        if (
          evilerRow >= 0 &&
          evilerRow <= 2 &&
          evilerCol >= 0 &&
          evilerCol <= 2
        ) {
          let cleanTpTileFound = false;
          let attempts = 1;
          while (!cleanTpTileFound) {
            const newRow = evilerRow + attempts;
            const newCol = evilerCol + attempts;
            const newIndex = newRow * columns + newCol;
            const targetButton = allButtons[newIndex];
            if (
              targetButton &&
              !targetButton.hasAttribute("data-wall") &&
              !targetButton.hasAttribute("data-evilIsOnTile") &&
              !targetButton.disabled
            ) {
              // teleport eviler
              targetButton.setAttribute("data-evilIsOnTile", "true");
              eviler.removeAttribute("data-evilIsOnTile");
              cleanTpTileFound = true;
            } else {
              attempts++;
            }
          }
        }

        const isPersonFocusedOnAnything = () => {
          const focusedElement = document.activeElement as HTMLElement;
          return focusedElement && focusedElement !== document.body;
        };
        // simple pathfinding: move one step closer to the player
        if (
          !document.hasFocus ||
          document.hidden ||
          !isPersonFocusedOnAnything()
        )
          return;

        let newRow = evilerRow;
        let newCol = evilerCol;

        if (playerRow < evilerRow) newRow--;
        else if (playerRow > evilerRow) newRow++;
        if (playerCol < evilerCol) newCol--;
        else if (playerCol > evilerCol) newCol++;

        const newIndex = newRow * columns + newCol;
        const targetButton = allButtons[newIndex];

        // if new pos is within 3x3 spawn, skip move
        const startRow = 0;
        const startCol = 0;
        if (
          newRow >= startRow &&
          newRow <= startRow + 2 &&
          newCol >= startCol &&
          newCol <= startCol + 2
        ) {
          return; // skip this move
        }

        if (
          targetButton &&
          !targetButton.hasAttribute("data-wall") &&
          !targetButton.hasAttribute("data-evilIsOnTile") &&
          !targetButton.disabled
        ) {
          // move eviler
          targetButton.setAttribute("data-evilIsOnTile", "true");
          eviler.removeAttribute("data-evilIsOnTile");

          // if eviler reaches player
          if (targetButton === playerButton) {
            // sound effect for caught
            PlayBeep(0.2, 200, 0.2);
            setTimeout(() => {
              PlayBeep(0.2, 100, 0.2);
            }, 200);
            // move focus to first non-wall tile
            const firstNonWall = allButtons.find(
              (btn) => !btn.hasAttribute("data-wall")
            );
            if (firstNonWall) {
              firstNonWall.focus();
            }
          }
        }
      });
    }, 1000); // move every second

    return () => clearInterval(interval);
  }, [columns]);

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

        moveFocusToButtonAtIndex(nextIndex, currentIndex);
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

          moveFocusToButtonAtIndex(newIndex, currentIndex);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [columns, moveFocusToButtonAtIndex]);
}
