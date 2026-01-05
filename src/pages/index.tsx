import { useEffect } from "react";
import ExitTile from "../components/ExitTile";
import Tile from "../components/Tile";

export default function Level1() {
  // Formula based on w-[5%] and h-[5%] in Tile.tsx
  const columns = 100 / 5; 
  const rows = 100 / 5;
  const totalTiles = columns * rows;
  const exitIndex = totalTiles / 1.91 // Position of the exit tile

  // on CapsLk or Ctrl, move up/down a row on the same column
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "CapsLock" || e.ctrlKey) {
        const focusedElement = document.activeElement as HTMLElement;
        if (focusedElement && focusedElement.tagName === "BUTTON") {
          const buttons = Array.from(document.querySelectorAll("button")) as HTMLButtonElement[];
          const currentIndex = buttons.indexOf(focusedElement as HTMLButtonElement);
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
  });

  return (
    <div>
      {Array.from({ length: exitIndex }).map((_, index) => (
        <Tile key={`tile-before-${index}`} />
      ))}
      <ExitTile nextLevel="/level2" />
      {Array.from({ length: totalTiles - exitIndex - 1 }).map((_, index) => (
        <Tile key={`tile-after-${index}`} />
      ))}
    </div>
  );
}
