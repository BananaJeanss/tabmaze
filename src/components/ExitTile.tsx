import { useEffect, useRef, useState } from "react";
import PlayBeep from "../hooks/beeper";
export interface ExitTileProps {
  customText?: string;
  nextLevel: string; // pathname
  showExit?: boolean;
}

export default function ExitTile({
  customText,
  nextLevel,
  showExit = false,
}: ExitTileProps) {
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
        PlayBeep(0.2, 660, 0.2);
        setTimeout(() => {
          PlayBeep(0.3, 880, 0.3);
        }, 200);
        setTimeout(() => {
          window.location.href = nextLevel;
        }, 300);
      }}
      className={`w-[5%] h-[5%] outline-none flex items-center justify-center ${
        isSelected || showExit
          ? " text-red-500! underline border border-red-500"
          : ""
      }`}
    >
      <div
        className={`flex flex-row items-center justify-center w-full h-full gap-2 in-[.nav-backward]:flex-row-reverse`}
      >
        <img
          src="/pixelatedFaRunning.png"
          style={{ width: "auto", height: "auto", maxWidth: 20, maxHeight: 20 }}
          className={`transition-transform in-[.nav-backward]:scale-x-[-1] invert-100 ${
            isSelected ? "" : "hidden"
          }`}
        />
        {customText || "EXIT"}
      </div>
    </button>
  );
}
