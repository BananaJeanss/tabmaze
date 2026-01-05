import { useEffect, useState } from "react";
import useControls from "../hooks/controls";
import MapRender from "../components/mapRender";

export default function Level2() {
  // Formula based on w-[5%] and h-[5%] in Tile.tsx
  const columns = 100 / 5;
  const rows = 100 / 5;

  // activate controls
  useControls(columns);

  // Store generated level in state to avoid impure function in render
  const [level, setLevel] = useState<("wall" | "exit" | "empty")[][]>([]);

  useEffect(() => {
    function generateLevel(cols: number, rows: number) {
      // for each col, if odd, spawn flappy bird typa wall

      // precalculate wall gaps
      const wallgaps: number[] = [];
      for (let r = 0; r < rows; r++) {
        if (Math.floor(Math.random() * 1.2) === 0) {
          wallgaps.push(r);
        }
      }

      const levelArray: ("wall" | "exit" | "empty")[][] = [];
      for (let r = 0; r < rows; r++) {
        const rowArray: ("wall" | "exit" | "empty")[] = [];
        for (let c = 0; c < cols; c++) {
          if (c === 0 || c === cols - 1) {
            // add precalc wall gaps
            if (wallgaps.includes(r)) {
              rowArray.push("empty");
            } else {
              rowArray.push("wall");
            }
          } else if (c === Math.floor(cols / 2) || c === Math.ceil(cols / 2) - 1) {
            rowArray.push("wall"); // wall always in middle
          } else {
            // fill rest with light garbage
            if (Math.floor(Math.random() * (10 - 1 + 1) + 1) === 1) {
              rowArray.push("wall");
            } else {
              rowArray.push("empty");
            }
          }
        }
        levelArray.push(rowArray);
      }

      // place exit
      levelArray[Math.floor(rows / 2)][cols - 1] = "exit";

      return levelArray;
    }

    const generatedLevel = generateLevel(columns, rows) ;
    setLevel(generatedLevel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MapRender level={level} />
  );
}
