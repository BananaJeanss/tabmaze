import { useSharedStopwatch } from "../hooks/stopwatch/useSharedStopwatch";
import useLocalStorage from "../hooks/useLocalStorage";

export interface StopwatchProps {
  ExtraText?: string;
}
export default function Stopwatch({ ExtraText }: StopwatchProps) {
  const { millis } = useSharedStopwatch();
  const [exits] = useLocalStorage<number>("infinite_exits", 0);

  if (ExtraText === "Infinite") {
    ExtraText += exits > 0 ? ` (Exits: ${exits})` : "";
  }

  return (
    <div className="absolute top-4 left-4 text-white text-2xl flex flex-row items-center gap-2">
      <p>
        {`${Math.floor(millis / 60000)}`.padStart(2, "0")}:
        {`${Math.floor((millis % 60000) / 1000)}`.padStart(2, "0")}.
        {`${Math.floor((millis % 1000) / 10)}`.padStart(3, "0")}
      </p>
      {ExtraText && (
        <>
          <div className="w-0.5 h-4 bg-white inline-block" />
          <p>{ExtraText}</p>
        </>
      )}
    </div>
  );
}