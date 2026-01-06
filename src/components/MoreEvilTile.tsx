import { useRef, useState } from "react";

// cause its optional
export default function MoreEvilTile() {
  const [isSelected, setIsSelected] = useState(false);
  // Removed useNavigation() to prevent re-renders
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleFocus = () => setIsSelected(true);
  const handleBlur = () => setIsSelected(false);

  return (
    <button
      ref={buttonRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`w-[5%] h-[5%] outline-none ${
        isSelected ? " text-white! border-4 border-white" : ""
      } data-evilIsOnTile:border-4 data-evilIsOnTile:border-red-600`}
      data-evilspawn
      data-evilisontile
    >
      {/* regular player img */}
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
        className="m-auto h-full hidden in-data-evilIsOnTile:block in-data-evilIsOnTile:opacity-100"
        alt="Evil Running Person"
      />
    </button>
  );
}
