import { useEffect, useRef, useState } from "react";
import PlayBeep from "../hooks/beeper";
import { useNavigate } from "react-router";
import { useSharedStopwatch } from "../hooks/stopwatch/useSharedStopwatch";
import useLocalStorage from "../hooks/useLocalStorage";
export interface ExitTileProps {
  customText?: string;
  nextLevel: string; // pathname
  showExit?: boolean;
  onExit?: () => void;
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

  const [exits, setExits] = useLocalStorage<number>("infinite_exits", 0);

  const navigate = useNavigate();
  const { stopTiming } = useSharedStopwatch();

  return (
    <button
      ref={buttonRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={() => {
        stopTiming();
        PlayBeep(0.2, 660, 0.2);
        setTimeout(() => {
          PlayBeep(0.3, 880, 0.3);
        }, 200);
        setTimeout(() => {
          if (nextLevel === "" || nextLevel === window.location.pathname) {
            if (window.location.pathname === "/infinite") {
              setExits(exits + 1);
            }
            window.location.reload();
          } else {
            navigate(nextLevel);
          }
        }, 300);
      }}
      className={`w-[5%] h-[5%] outline-none flex items-center justify-center ${
        isSelected || showExit
          ? " text-red-500! underline border-4 border-red-500"
          : ""
      }`}
    >
      <div
        className={`flex flex-row items-center justify-center w-full h-full gap-2 in-[.nav-backward]:flex-row-reverse`}
      >
        <img
          src="/pixelatedFaRunning.png"
          style={{ width: "auto", height: "auto", maxWidth: 20, maxHeight: 20 }}
          className={`in-[.nav-backward]:scale-x-[-1] ${
            isSelected ? "" : "hidden"
          }`}
        />
        {customText || "EXIT"}
      </div>
    </button>
  );
}
