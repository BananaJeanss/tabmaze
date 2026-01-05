import EvilTile from "./EvilTile";
import ExitTile from "./ExitTile";
import Tile from "./Tile";
import WallTile from "./WallTile";

export default function MapRender({ level, nextLevel }: { level: ("wall" | "exit" | "empty" | "evil")[][]; nextLevel: string }) {
  return (
    <div>
      {level.map((row, rowIndex) =>
        row.map((tileType, colIndex) => {
          const key = `tile-${rowIndex}-${colIndex}`;
          if (tileType === "wall") {
            return <WallTile key={key} showWall={true} />;
          } else if (tileType === "exit") {
            return <ExitTile key={key} nextLevel={nextLevel} showExit={true} />;
          } else if (tileType === "evil") {
            return <EvilTile key={key} />;
          } else {
            return <Tile key={key} />;
          }
        })
      )}
    </div>
  );
}
