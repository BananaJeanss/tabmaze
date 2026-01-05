export interface WallTileProps {
    customText?: string;
    showWall: boolean;
}

export default function WallTile({ customText, showWall }: WallTileProps) {
    const wallStyle = showWall ? "bg-gray-800" : "bg-transparent border border-gray-800";

    return (
        <div
            className={`w-[5%] h-[5%] ${wallStyle} flex items-center justify-center`}
        >
            {customText || ""}
        </div>
    );
}