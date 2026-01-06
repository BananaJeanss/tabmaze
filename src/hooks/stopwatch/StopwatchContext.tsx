import { createContext } from "react";
import type { useStopwatch } from "./useStopwatch";

export const StopwatchContext = createContext<ReturnType<typeof useStopwatch> | null>(null);