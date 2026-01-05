import ExitTile from "../components/ExitTile";
import Tile from "../components/Tile";
import WallTile from "../components/WallTile";
import useControls from "../hooks/controls";

export default function Level1() {
  // Formula based on w-[5%] and h-[5%] in Tile.tsx
  const columns = 100 / 5;
  const rows = 100 / 5;
  const totalTiles = columns * rows;
  const exitIndex = totalTiles / 1.91;

  // activate controls (including mobile controls)
  useControls(columns);

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
