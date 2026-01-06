import { useEffect, useState } from "react";
import { GoTab } from "react-icons/go";

// big TAB screen
export default function TAB() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_PersonFocused, SetPersonFocused] = useState(false);
  const isPersonFocusedOnAnything = () => {
    const focusedElement = document.activeElement as HTMLElement;
    return focusedElement && focusedElement !== document.body;
  };

  useEffect(() => {
    const handleFocusChange = () => {
      SetPersonFocused(isPersonFocusedOnAnything());
    };

    window.addEventListener("focusin", handleFocusChange);
    window.addEventListener("focusout", handleFocusChange);

    return () => {
      window.removeEventListener("focusin", handleFocusChange);
      window.removeEventListener("focusout", handleFocusChange);
    };
  }, []);

  const [flipflop, setFlipflop] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipflop((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-screen h-screen absolute top-0 left-0 bg-black/50 flex z-100 flex-nowrap! items-center justify-center text-white text-[25vw]`}
      style={{ display: isPersonFocusedOnAnything() ? "none" : "flex" }}
    >
      {flipflop ? "TAB" : <GoTab />
      }
    </div>
  );
}
// <img
//        src="/pxltab.png"
//        style={{ width: "auto", height: "50vh", maxWidth: "90vw", maxHeight: "90vh", filter: "invert(100%)" }}
//        alt="TAB Icon"
//          />