import { useRef, useState } from "react";

export interface OneWayTileProps {
  whichWay: "left" | "right" | "up" | "down";
}

export default function OneWayTile({ whichWay }: OneWayTileProps) {
  const [isSelected, setIsSelected] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleFocus = () => setIsSelected(true);
  const handleBlur = () => setIsSelected(false);
  const borderMap: Record<string, string> = {
    left: "border-r-4",
    right: "border-l-4",
    up: "border-b-4",
    down: "border-t-4",
  };
  const blueMap: Record<string, string> = {
    left: "border-r-blue-500",
    right: "border-l-blue-500",
    up: "border-b-blue-500",
    down: "border-t-blue-500",
  };
  return (
    <button
      ref={buttonRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`w-[5%] h-[5%] flex items-center justify-center border-4 ${isSelected ? "border-white" : "border-gray-500/50"} ${borderMap[whichWay]} ${blueMap[whichWay]} outline-none`}
      data-onewaytile
      data-onewaydirection={whichWay}
    >
              <img
        src="/pixelatedFaRunning.png"
        style={{
          width: "auto",
          height: "auto",
          maxWidth: 20,
          maxHeight: 20,
        }}
        className={`m-auto h-full in-[.nav-backward]:scale-x-[-1] ${
          isSelected ? "" : "hidden opacity-0"
        }`}
        alt="Running Person"
      />
            {/* evil player img */}
      <img
        src="/pixelatedFaRunning.png"
        style={{
          width: "auto",
          height: "auto",
          maxWidth: 20,
          maxHeight: 20,
          filter: "brightness(0) saturate(100%) invert(16%) sepia(91%) saturate(7483%) hue-rotate(358deg) brightness(97%) contrast(118%)",
        }}
        className="m-auto h-full hidden in-data-evilIsOnTile:block in-data-evilIsOnTile:opacity-100 "
        alt="Evil Running Person"
      />
    </button>
  );
}
