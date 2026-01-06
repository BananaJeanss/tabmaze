import { GoTab } from "react-icons/go";
import { BsCapslock, BsShift } from "react-icons/bs";

export interface MobileControlsProps {
  keyPressed: (key: string) => void;
}

export default function MobileControls({ keyPressed }: MobileControlsProps) {
  const preventFocusSteal = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
  };

  const ButtonStyling =
    "bg-gray-800/50 border border-gray-600/70 text-white px-6 py-6 rounded-full pointer-events-auto aspect-square flex items-center justify-center";
  return (
    <>
      {/* left side controls */}
      <div className="fixed flex flex-col gap-4 bottom-1/3 left-1/10 transform -translate-x-1/2 z-50 pointer-events-none">
        <button
          onMouseDown={preventFocusSteal}
          onTouchStart={(e) => {
            preventFocusSteal(e);
          }}
          onClick={() => keyPressed("ShiftTab")}
          className={ButtonStyling}
          tabIndex={-1}
        >
          <BsShift />
        </button>
        <button
          onClick={() => keyPressed("Ctrl")}
          onMouseDown={preventFocusSteal}
          onTouchStart={(e) => {
            preventFocusSteal(e);
          }}
          className={ButtonStyling}
          tabIndex={-1}
        >
          Ctrl
        </button>
      </div>
      {/* right side controls */}
      <div className="fixed flex flex-col gap-4 bottom-1/3 right-1/10 transform translate-x-1/2 z-50 pointer-events-none">
        <button
          onMouseDown={preventFocusSteal}
          onTouchStart={(e) => {
            preventFocusSteal(e);
          }}
          onClick={() => keyPressed("Tab")}
          className={ButtonStyling}
          tabIndex={-1}
        >
          <GoTab />
        </button>
        <button
          onClick={() => keyPressed("CapsLock")}
          onMouseDown={preventFocusSteal}
          onTouchStart={(e) => {
            preventFocusSteal(e);
          }}
          className={ButtonStyling}
          tabIndex={-1}
        >
          <BsCapslock />
        </button>
      </div>
    </>
  );
}
