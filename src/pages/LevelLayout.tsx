import { Outlet } from "react-router";
import TAB from "../components/TAB";

export default function LevelLayout() {
  return (
    <>
      <TAB />
      <Outlet />
    </>
  );
}
