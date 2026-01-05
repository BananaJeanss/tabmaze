import { useEffect } from "react";
import ExitTile from "../components/ExitTile";
import Tile from "../components/Tile";
import WallTile from "../components/WallTile";

export default function Level1() {
  // Formula based on w-[5%] and h-[5%] in Tile.tsx
  const columns = 100 / 5;
  const rows = 100 / 5;
  const totalTiles = columns * rows;
  const exitIndex = totalTiles / 1.91;

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

  function generateLevel(cols: number, rows: number, exitRow: number) {
    const middleCols = [Math.floor(cols / 2), Math.ceil(cols / 2) - 1];

    return Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => {
        // Middle column wall, except exit row
        if (middleCols.includes(col)) {
          return row === exitRow ? "exit" : "wall";
        }
        return "tile";
      })
    );
  }

  return (
    <div>
      {generateLevel(columns, rows, Math.floor(exitIndex / columns)).map(
        (row, rowIndex) =>
          row.map((tileType, colIndex) => {
            const key = `tile-${rowIndex}-${colIndex}`;
            if (tileType === "wall") {
              return <WallTile key={key} showWall={true} />;
            } else if (tileType === "exit") {
              return <ExitTile key={key} nextLevel="/level2" />;
            } else {
              return <Tile key={key} />;
            }
          })
      )}
    </div>
  );
}
