import { useRef, useState } from "react";

// cause its optional
export default function Tile() {
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
        isSelected ? " text-white! border border-white" : ""
      }`}
    >
      {/* 
        [.nav-backward_&]:scale-x-[-1] 
        This means: "When an ancestor has class .nav-backward, apply scale-x-[-1] to this element"
      */}
      <img
        src="/pixelatedFaRunning.png"
        style={{ width: "auto", height: "auto", maxWidth: 20, maxHeight: 20, filter: isSelected ? "invert(100%)" : "invert(0%)" }}
        className="m-auto h-full in-[.nav-backward]:scale-x-[-1]"
        alt="Running Person"
      />
    </button>
  );
}
