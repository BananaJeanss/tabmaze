import { useEffect, useRef, useState } from "react";
import { FaPersonRunning } from "react-icons/fa6";
export interface ExitTileProps {
  customText?: string;
  nextLevel: string; // pathname
}

export default function ExitTile({ customText, nextLevel }: ExitTileProps) {
  const [isSelected, setIsSelected] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleFocus = () => setIsSelected(true);
  const handleBlur = () => setIsSelected(false);

  // type "devskip" to focus on exit tile for testing
  useEffect(() => {
    const target = "devskip";
    let index = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === target[index]) {
        index++;
        if (index === target.length) {
          buttonRef.current?.focus();
          index = 0;
        }
      } else {
        // Reset index, but check if the current key starts the sequence
        index = e.key.toLowerCase() === target[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <button
      ref={buttonRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={() => {
        window.location.href = nextLevel;
      }}
      className={`w-[5%] h-[5%] outline-none flex items-center justify-center ${
        isSelected ? " text-red-500! underline border border-red-500" : ""
      }`}
    >
      <div
        className={`flex flex-row items-center justify-center w-full h-full gap-2 in-[.nav-backward]:flex-row-reverse`}
      >
        <FaPersonRunning className="transition-transform in-[.nav-backward]:scale-x-[-1]" />
        {customText || "EXIT"}
      </div>
    </button>
  );
}
