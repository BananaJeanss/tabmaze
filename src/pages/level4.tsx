import { useEffect, useState } from "react";
import useControls from "../hooks/controls";
import MapRender from "../components/mapRender";
import type { CellType } from "../types/types";
import { PORTAL_COLORS } from "../hooks/color";

export default function Level5() {
  const columns = Math.floor(100 / 5);
  const rows = Math.floor(100 / 5);

  // activate controls
  useControls(columns);

  // Store generated level in state to avoid impure function in render
  const [level, setLevel] = useState<CellType[][]>([]);

  useEffect(() => {
    function generateLevel(cols: number, rows: number): CellType[][] {
      // 1) Build a complete base grid first (walls/empty)
      const grid: CellType[][] = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, (_, c): CellType => {
          if (
            c === 0 ||
            c === cols - 1 ||
            c === Math.floor(cols / 4) ||
            c === Math.ceil(cols / 2) - 1
          ) {
            return "wall";
          }
          return "empty";
        })
      );

      // 2) Place exit (so portals won't target it)
      grid[rows - 1][cols - 1] = "exit";

      // 3) Decide portal locations first
      const portalPositions: Array<[number, number]> = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c] !== "empty") continue;
          if (c === 1 || c === cols - 2) continue;

          if (Math.random() < 0.1) {
            portalPositions.push([r, c]);
          }
        }
      }

      const portalPosSet = new Set(
        portalPositions.map(([r, c]) => `${r},${c}`)
      );

      // 4) Build destination pool from remaining empty cells (not walls/exits/portals)
      const destinations: Array<[number, number]> = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c] !== "empty") continue;
          if (portalPosSet.has(`${r},${c}`)) continue;
          destinations.push([r, c]);
        }
      }

      const portalColors = Object.keys(PORTAL_COLORS);

      // 5) Place portals with guaranteed-valid destinations
      for (const [r, c] of portalPositions) {
        if (destinations.length === 0) break;

        const randomColor =
          portalColors[Math.floor(Math.random() * portalColors.length)] ??
          "blue";

        // pick a destination not equal to itself (normally already excluded, but safe)
        let to = destinations[Math.floor(Math.random() * destinations.length)]!;
        if (to[0] === r && to[1] === c && destinations.length > 1) {
          to =
            destinations[(destinations.indexOf(to) + 1) % destinations.length]!;
        }

        grid[r][c] = ["portal", { to, color: randomColor }];
      }

      return grid;
    }

    setLevel(generateLevel(columns, rows));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <MapRender level={level} nextLevel="/level5" showExit={true} />;
}
