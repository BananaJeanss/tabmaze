import { type ReactNode } from "react";
import { useStopwatch } from "./useStopwatch";
import { StopwatchContext } from "./StopwatchContext";

export function StopwatchProvider({ children }: { children: ReactNode }) {
  const stopwatch = useStopwatch();
  return (
    <StopwatchContext.Provider value={stopwatch}>
      {children}
    </StopwatchContext.Provider>
  );
}