import { Outlet } from "react-router";
import TAB from "../components/TAB";
import Stopwatch from "../components/Stopwatch";
import { StopwatchProvider } from "../hooks/stopwatch/StopwatchProvider";

export default function LevelLayout() {
  const isInfinite = window.location.pathname === "/infinite";
  const ExtraText = isInfinite ? "Infinite" : undefined;
  return (
    <>
      <StopwatchProvider>
        <TAB />
        <Stopwatch ExtraText={ExtraText} />
        <Outlet />
      </StopwatchProvider>
    </>
  );
}
