import type { CellType } from "../types/types";
import EvilTile from "./EvilTile";
import ExitTile from "./ExitTile";
import Tile from "./Tile";
import WallTile from "./WallTile";

export interface MapRenderProps {
  level: CellType[][];
  nextLevel: string;
  showExit: boolean;
}

export default function MapRender({ level, nextLevel, showExit }: MapRenderProps) {
  return (
    <div>
      {level.map((row, rowIndex) =>
        row.map((tileType, colIndex) => {
          const key = `tile-${rowIndex}-${colIndex}`;
          if (tileType === "wall") {
            return <WallTile key={key} showWall={true} />;
          } else if (tileType === "exit") {
            return <ExitTile key={key} nextLevel={nextLevel} showExit={showExit} />;
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
