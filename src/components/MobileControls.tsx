import { GoTab } from "react-icons/go";
import { BsCapslock, BsShift } from "react-icons/bs";

export interface MobileControlsProps {
  keyPressed: (key: string) => void;
}

export default function MobileControls({ keyPressed }: MobileControlsProps) {
  const preventFocusSteal = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
  };
  return (
    <div className="fixed bottom-4 left-8 grid grid-cols-3 grid-rows-2 gap-2 z-50 pointer-events-auto">
      <button
        onClick={() => keyPressed("Ctrl")}
        onMouseDown={preventFocusSteal}
        onTouchStart={(e) => {
          preventFocusSteal(e);
          keyPressed("Ctrl");
        }}
        className="bg-gray-800 text-white px-6 py-2 rounded-full grow pointer-events-auto"
        tabIndex={-1}
      >
        Ctrl
      </button>
      <button
        onMouseDown={preventFocusSteal}
        onTouchStart={(e) => {
          preventFocusSteal(e);
          keyPressed("Tab");
        }}
        onClick={() => keyPressed("Tab")}
        className="bg-gray-800 text-white px-6 py-4 rounded-full pointer-events-auto"
        tabIndex={-1}
      >
        <GoTab />
      </button>
      <button
        onClick={() => keyPressed("CapsLock")}
        onMouseDown={preventFocusSteal}
        onTouchStart={(e) => {
          preventFocusSteal(e);
          keyPressed("CapsLock");
        }}
        className="bg-gray-800 text-white px-6 py-4 rounded-full pointer-events-auto"
        tabIndex={-1}
      >
        <BsCapslock />
      </button>
      <button
        onMouseDown={preventFocusSteal}
        onTouchStart={(e) => {
          preventFocusSteal(e);
          keyPressed("ShiftTab");
        }}
        onClick={() => keyPressed("ShiftTab")}
        className="bg-gray-800 text-white px-6 py-4 rounded-full pointer-events-auto"
        tabIndex={-1}
      >
        <BsShift />
      </button>
    </div>
  );
}
