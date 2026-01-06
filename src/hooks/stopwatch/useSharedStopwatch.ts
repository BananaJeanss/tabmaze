import { useContext } from "react";
import { StopwatchContext } from "./StopwatchContext";

export function useSharedStopwatch() {
  const context = useContext(StopwatchContext);
  if (!context) {
    throw new Error("useSharedStopwatch must be used within StopwatchProvider");
  }
  return context;
}