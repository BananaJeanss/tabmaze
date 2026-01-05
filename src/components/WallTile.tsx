export interface WallTileProps {
  customText?: string;
  showWall: boolean;
}

function bricks() {
  return (
    <div className="w-full h-full grid grid-rows-4 grid-cols-4 gap-0">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="border border-gray-700 bg-gray-700/40 w-full h-full"
        />
      ))}
    </div>
  );
}

export default function WallTile({ customText, showWall }: WallTileProps) {
  const wallStyle = showWall
    ? "bg-transparent border border-gray-800"
    : "hidden";

  return (
    <button
      disabled={showWall}
      className={`w-[5%] h-[5%] ${wallStyle} flex items-center justify-center`}
      data-wall
    >
      {customText || bricks()}
    </button>
  );
}
