import { useState } from "react";
import MapRender from "../components/mapRender";
import useControls from "../hooks/controls";
import type { CellType } from "../types/types";

export default function Level1() {
  // Formula based on w-[5%] and h-[5%] in Tile.tsx
  const columns = 100 / 5;
  const rows = 100 / 5;
  const totalTiles = columns * rows;
  const exitIndex = totalTiles / 1.91;

  // activate controls (including mobile controls)
  useControls(columns);

  const [level] = useState<CellType[][]>(generateLevel(columns, rows, Math.floor(exitIndex / columns)));

  function generateLevel(cols: number, rows: number, exitRow: number) {
    const middleCols = [Math.floor(cols / 2), Math.ceil(cols / 2) - 1];

    return Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col): CellType => {
        // Middle column wall, except exit row
        if (middleCols.includes(col)) {
          return row === exitRow ? "exit" : "wall";
        }
        return "empty";
      })
    );
  }

  return <MapRender level={level} nextLevel="/level2" showExit={false} />;
}
