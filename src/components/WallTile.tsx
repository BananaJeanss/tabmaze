import { useMemo } from "react";

export interface WallTileProps {
  customText?: string;
  showWall: boolean;
}

function bricks() {
  return (
    <div className="w-full h-full grid grid-rows-5 grid-cols-5 gap-0">
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className={` w-full h-full${i % 2 === Math.floor(Math.random() * 3) ? " bg-gray-500/50" : "bg-transparent"}`}
        />
      ))}
    </div>
  );
}

export default function WallTile({ customText, showWall }: WallTileProps) {
  const wallContent = useMemo(() => bricks(), []);

  const wallStyle = showWall
    ? "bg-transparent border-4 border-gray-500/50"
    : "hidden";

  return (
    <button
      disabled={showWall}
      className={`w-[5%] h-[5%] ${wallStyle} flex items-center justify-center`}
      data-wall
    >
      {customText || wallContent}
    </button>
  );
}
