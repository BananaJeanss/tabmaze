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
      const grid: CellType[][] = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, (_, c): CellType => {
          for (let r = 0; r < rows; r++) {
            if (c === cols / 2 && r === Math.floor(Math.random() * 50)) {
              return ["oneway", { direction: "right" }];
            } else if (c === cols / 2 - 1 && r) {
              return "empty";
            }
          }
          return Math.random() < 0.2 ? "wall" : "empty";
        })
      );

      // place exit
      grid[rows - 1][cols - 1] = "exit";

      return grid;
    }

    let isBeatable = false;
    while (isBeatable) {
      const generatedLevel = generateLevel(columns, rows);
      isBeatable = MazeTester({ maze: generatedLevel });
      console.log("Level generated, beatable:", isBeatable);
      if (isBeatable) {
        setLevel(generatedLevel);
      }
    }

    console.log("Generated level is beatable:", isBeatable);

    setLevel(generateLevel(columns, rows));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <MapRender level={level} nextLevel="/level6" showExit={true} />;
}
