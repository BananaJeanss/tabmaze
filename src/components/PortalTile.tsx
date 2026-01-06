export interface PortalTileProps {
    TeleportTo: [number, number] | null; // row col
    AnyColor: string // Tailwind color class for portal
}

export default function PortalTile({ TeleportTo, AnyColor }: PortalTileProps) {
    const portalStyle = TeleportTo
        ? `bg-${AnyColor}-500/70 border-4 border-${AnyColor}-300/70 animate-pulse`
        : "hidden";

    return (
        <button
            disabled={!TeleportTo}
            className={`w-[5%] h-[5%] ${portalStyle} flex items-center justify-center`}
            data-portal
        >
            {TeleportTo ? `→ (${TeleportTo[0]}, ${TeleportTo[1]})` : null}
        </button>
    );
}