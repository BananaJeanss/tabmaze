// evil ass tile
import { useRef, useState, useMemo } from "react";

export default function EvilTile() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [brickPattern] = useState(() =>
    Array.from({ length: 49 }, () => Math.floor(Math.random() * 3))
  );


  const brickElements = useMemo(
    () => (
      <div className="w-full h-full grid grid-rows-7 grid-cols-7 gap-0">
        {brickPattern.map((randomVal, i) => (
          <div
            key={i}
            className={`w-full h-full ${
              i % 2 === randomVal ? "bg-red-500/50" : "bg-transparent"
            }`}
          />
        ))}
      </div>
    ),
    [brickPattern]
  );

  return (
    <button
      ref={buttonRef}
      className={`w-[5%] h-[5%] bg-transparent border-4 border-red-500/50 flex items-center justify-center
      }`}
      data-evil
    >
      <div
        className={`flex flex-row items-center justify-center w-full h-full gap-2 in-[.nav-backward]:flex-row-reverse`}
      >
        {brickElements}
      </div>
    </button>
  );
}
