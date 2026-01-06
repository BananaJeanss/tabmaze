import { useEffect, useState } from "react";
import useControls from "../hooks/controls";
import MapRender from "../components/mapRender";
import type { CellType } from "../types/types";
import MazeTester from "../hooks/MazeTester";

export default function Infinite() {
  const [levelKey] = useState(0);
  const columns = Math.floor(100 / 5);
  const rows = Math.floor(100 / 5);

  // activate controls
  useControls(columns);

  // Store generated level in state to avoid impure function in render
  const [level, setLevel] = useState<CellType[][]>([]);

  // Regenerate level when key changes
  useEffect(() => {
    function generateLevel(cols: number, rows: number): CellType[][] {
      const grid: CellType[][] = [];
      const ChaosValue = Math.floor(Math.random() * 4); // 0-3

      for (let r = 0; r < rows; r++) {
        const rowArray: CellType[] = [];
        for (let c = 0; c < cols; c++) {
          if (ChaosValue > 1 && ChaosValue < 2) {
            // rooms
            if (Math.random() < Math.min(0.3, 5 / cols)) {
              rowArray.push("wall");
            } else {
              rowArray.push("empty");
            }
          } else if (ChaosValue >= 2) {
            // maze-like
            if (r % 5 === 0 || c % 5 === 0) {
              if (Math.random() < 0.2) {
                if (Math.random() < 0.5) {
                  rowArray.push("empty");
                } else {
                  const directions = ["up", "down", "left", "right"];
                  const randomDirection =
                    directions[Math.floor(Math.random() * 4)];
                  rowArray.push([
                    "oneway",
                    { direction: randomDirection },
                  ] as CellType);
                }
              } else {
                rowArray.push("wall");
              }
            } else {
              rowArray.push("empty");
            }
          } else if (ChaosValue <= 1 && ChaosValue >= 0.5) {
            // random
            if (Math.random() < 0.2) {
              const directions = ["up", "down", "left", "right"];
              const randomDirection = directions[Math.floor(Math.random() * 4)];
              rowArray.push(
                Math.random() < 0.1
                  ? "wall"
                  : (["oneway", { direction: randomDirection }] as CellType)
              );
            } else {
              rowArray.push("empty");
            }
          } else {
            // big wall
            if (
              c === Math.floor(cols / 2) ||
              c === Math.floor(cols / 2) - 1 ||
              r === Math.floor(rows / 2) ||
              r === Math.floor(rows / 2) - 1
            ) {
              rowArray.push("wall");
            } else {
              rowArray.push("empty");
            }
          }
        }
        grid.push(rowArray);
      }

      // empty cells have a chance to turn into sumn else
      let evilersCount = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c] === "empty") {
            const roll = Math.random();
            if (roll < 0.05) {
              grid[r][c] = "wall";
            } else if (roll >= 0.05 && roll < 0.1) {
              grid[r][c] = "evil";
            } else if (roll >= 0.1 && roll < 0.11) {
              if (evilersCount < 4) {
                grid[r][c] = "eviler";
                evilersCount++;
              } else {
                // compensatory wall for your troubles
                grid[r][c] = "wall";
              }
            } else if (roll >= 0.11 && roll < 0.15) {
              const directions = ["up", "down", "left", "right"];
              const randomDirection = directions[Math.floor(Math.random() * 4)];
              grid[r][c] = [
                "oneway",
                { direction: randomDirection },
              ] as CellType;
            } else if (roll >= 0.15 && roll < 0.17) {
              // portal to random location
              let foundGoodTarget = false;
              let toRow = 0;
              let toCol = 0;
              while (!foundGoodTarget) {
                toRow = Math.floor(Math.random() * rows);
                toCol = Math.floor(Math.random() * cols);
                if (
                  grid[toRow][toCol] === "empty" &&
                  (toRow !== r || toCol !== c)
                ) {
                  foundGoodTarget = true;
                }   
              }
              const colors = [
                "bg-red-500/50",
                "bg-blue-500/50",
                "bg-green-500/50",
                "bg-yellow-500/50",
                "bg-purple-500/50",
              ];
              const color = colors[Math.floor(Math.random() * colors.length)];
              grid[r][c] = [
                "portal",
                { to: [toRow, toCol], color },
              ] as CellType;
            }
          }
        }
      }

      // place exit
      // Define possible exit positions
      const exitPositions = [
        [3, 0], // top-leftish
        [0, Math.floor(cols / 2)], // top-center
        [0, 6], // left-center
        [rows - 7, cols - 1], // right-center
        [0, cols - 1], // top-right
        [rows - 1, 0], // bottom-left
        [rows - 1, cols - 1], // bottom-right
        [Math.floor(rows / 2), 0], // mid-left
        [Math.floor(rows / 2), cols - 1], // mid-right
        [rows - 1, Math.floor(cols / 2)], // bottom-center
        [Math.floor(rows / 2), Math.floor(cols / 2)], // center
      ];

      // Add a random position
      exitPositions.push([
        Math.floor(Math.random() * rows),
        Math.floor(Math.random() * cols),
      ]);

      // Shuffle exit positions for randomness
      function shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }
      const shuffledExits = shuffleArray(exitPositions);
      const numExits = 1 + Math.floor(Math.random() * 1);
      let placed = 0;
      for (let i = 0; i < shuffledExits.length && placed < numExits; i++) {
        const [r, c] = shuffledExits[i];
        if (
          r >= 0 &&
          r < rows &&
          c >= 0 &&
          c < cols &&
          grid[r][c] !== "wall" &&
          grid[r][c] !== "exit"
        ) {
          grid[r][c] = "exit";
          placed++;
        }
      }
      return grid;
    }

    let isBeatable = false;
    let generatedLevel: CellType[][] = [];
    while (!isBeatable) {
      generatedLevel = generateLevel(columns, rows);
      isBeatable = MazeTester({ maze: generatedLevel });
      console.log("Level generated, beatable:", isBeatable);
    }

    console.log("Generated level is beatable:", isBeatable);
    setLevel(generatedLevel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelKey]);

  const showExit = true;

  return (
    <MapRender
      key={levelKey}
      level={level}
      nextLevel={``}
      showExit={showExit}
    />
  );
}
