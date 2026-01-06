import type { CellType, PortalCell } from "../types/types";
import EvilTile from "./EvilTile";
import ExitTile from "./ExitTile";
import Tile from "./Tile";
import WallTile from "./WallTile";
import PortalTile from "./PortalTile";

export interface MapRenderProps {
  level: CellType[][];
  nextLevel: string;
  showExit: boolean;
}

function isPortal(cell: CellType): cell is PortalCell {
  return Array.isArray(cell) && cell[0] === "portal";
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
          } else if (isPortal(tileType)) {
            const [, data] = tileType;
            return <PortalTile key={key} TeleportTo={data.to} AnyColor={data.color || "blue"} />;
          } else {
            return <Tile key={key} />;
          }
        })
      )}
    </div>
  );
}
