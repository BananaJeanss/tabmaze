import { useRef, useState } from "react";
import { FaPersonRunning } from "react-icons/fa6";

export interface TileProps {
  customText?: string;
}

export default function Tile({ customText }: TileProps) {
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
      <FaPersonRunning className="m-auto transition-transform in-[.nav-backward]:scale-x-[-1]" />
    </button>
  );
}
