import ExitTile from "./ExitTile";
import Tile from "./Tile";
import WallTile from "./WallTile";

export default function MapRender({ level }: { level: ("wall" | "exit" | "empty")[][] }) {
  return (
    <div>
      {level.map((row, rowIndex) =>
        row.map((tileType, colIndex) => {
          const key = `tile-${rowIndex}-${colIndex}`;
          if (tileType === "wall") {
            return <WallTile key={key} showWall={true} />;
          } else if (tileType === "exit") {
            return <ExitTile key={key} nextLevel="/level2" showExit={true} />;
          } else {
            return <Tile key={key} />;
          }
        })
      )}
    </div>
  );
}
