import { PORTAL_COLORS } from "../hooks/color";

export interface PortalTileProps {
  TeleportTo: [number, number] | null; // row col
  AnyColor: string; // Tailwind color name (e.g. "purple")
}


export default function PortalTile({ TeleportTo, AnyColor = "blue" }: PortalTileProps) {
  const c = PORTAL_COLORS[AnyColor] ?? PORTAL_COLORS.blue;
  const portalStyle = `${c.bg} border-4 border-solid ${c.border}`;

  const portalTo = TeleportTo ? `${TeleportTo[0]},${TeleportTo[1]}` : "";

  return (
    <button
      disabled={!TeleportTo}
      className={`w-[5%] h-[5%] ${portalStyle} flex items-center justify-center`}
      data-portal
      data-portal-to={portalTo}
    >
        
    </button>
  );
}