import useLocalStorage from "../hooks/useLocalStorage";

export default function Settings({
  setSettingsOpen,
}: {
  setSettingsOpen: (open: boolean) => void;
}) {
  const [beeperEnabled, setBeeperEnabled] = useLocalStorage<boolean>(
    "beeperEnabled",
    false
  );

  return (
    <div
      className={`absolute top-0 left-0 h-screen w-screen z-100 flex bg-black/50 items-center justify-center flex-nowrap!`}
      id="settings-modal"
    >
      <div className="bg-black border-4 border-white p-4 text-white w-3/4 max-w-md">
        <h2 className="text-2xl mb-4">Settings</h2>
        <div className="flex flex-row gap-2">
          <input
            type="checkbox"
            checked={beeperEnabled}
            onChange={(e) => {
              setBeeperEnabled(e.target.checked);
            }}
          />
          <label>Beeper</label>
        </div>
        <button
          onClick={() => setSettingsOpen(false)}
          className="mt-4 px-4 py-2 bg-white text-black border-2 border-black cursor-pointer!"
        >
          Close
        </button>
      </div>
    </div>
  );
}
