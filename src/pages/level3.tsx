import { useEffect, useState } from "react";
import useControls from "../hooks/controls";
import MapRender from "../components/mapRender";
import type { CellType } from "../types/types";

export default function Level3() {
  const columns = 100 / 5;
  const rows = 100 / 5;

  // activate controls
  useControls(columns);

  // Store generated level in state to avoid impure function in render
  const [level, setLevel] = useState<CellType[][]>([]);

  useEffect(() => {
    function generateLevel(cols: number, rows: number) {
      // random garbage level

      const levelArray: CellType[][] = [];
      for (let r = 0; r < rows; r++) {
        const rowArray: CellType[] = [];
        for (let c = 0; c < cols; c++) {
          if (c === 0 || c === cols - 1 || r === 0 || r === rows - 1) {
            rowArray.push("wall");
          } else if (
            Math.floor(Math.random() * 3 + 1) % 10 === 1 &&
            c !== 1 &&
            c !== cols - 2
          ) {
            rowArray.push("evil");
          } else {
            rowArray.push("empty");
          }
        }
        levelArray.push(rowArray);
      }

      // place exit
      levelArray[Math.floor(rows / 2)][cols - 1] = "exit";

      return levelArray;
    }

    const generatedLevel = generateLevel(columns, rows);
    setLevel(generatedLevel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <MapRender level={level} nextLevel="/level4" showExit={true} />;
}
