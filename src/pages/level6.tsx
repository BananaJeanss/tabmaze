import { useEffect, useState } from "react";
import useControls from "../hooks/controls";
import MapRender from "../components/mapRender";
import type { CellType } from "../types/types";
import MazeTester from "../hooks/MazeTester";

export default function Level6() {
  const columns = Math.floor(100 / 5);
  const rows = Math.floor(100 / 5);

  // activate controls
  useControls(columns);

  // Store generated level in state to avoid impure function in render
  const [level, setLevel] = useState<CellType[][]>([]);

  useEffect(() => {
    function generateLevel(cols: number, rows: number): CellType[][] {
      const grid: CellType[][] = [];
      const evilerRow = Math.floor(rows / 2);
      const evilerCol = Math.floor(cols / 2);

      for (let r = 0; r < rows; r++) {
        const rowArray: CellType[] = [];
        for (let c = 0; c < cols; c++) {
          if (r === evilerRow && c === evilerCol) {
            rowArray.push("eviler");
            console.log("Spawned eviler at", r, c);
          } else if (Math.random() < 0.05) {
            rowArray.push("wall");
          } else if (c % 6 === 0 || r % 7 === 0) { // six sayveeeeen
            // Some one-way tiles in the middle column with random direction
            const directions = ["up", "down", "left", "right"] as const;
            const roll = Math.floor(Math.random() * directions.length);
            rowArray.push([
              "oneway",
              { direction: directions[roll] },
            ] as CellType);
          } else {
            rowArray.push("empty");
          }
        }
        grid.push(rowArray);
      }

      for (let r = 0; r < rows; r++) grid[r][0] = "wall";
      for (let r = 0; r < rows; r++) grid[r][cols - 1] = "wall";

      // place exit
      grid[rows - 1][cols - 1] = "exit";

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
  }, []);

  return <MapRender level={level} nextLevel="/level6" showExit={true} />;
}
