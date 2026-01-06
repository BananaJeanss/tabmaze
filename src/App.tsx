import { Suspense, lazy, type ComponentType } from "react";
import Page404 from "./pages/404";
import Sussy from "./components/sussy";
import TAB from "./components/TAB";

// 1. Auto-import all .tsx files from the src/pages folder
const pages = import.meta.glob("./pages/*.tsx");

// 2. Create a route map dynamically
const routes = Object.keys(pages).reduce((acc, filePath) => {
  const name = filePath.match(/\.\/pages\/(.*)\.tsx$/)?.[1];

  if (name) {
    const routePath = name === "index" ? "/" : `/${name}`;
    acc[routePath] = lazy(
      pages[filePath] as () => Promise<{ default: ComponentType }>
    );
  }
  return acc;
}, {} as Record<string, React.LazyExoticComponent<ComponentType>>);

export default function App() {
  const path =
    window.location.pathname === "/index.html" ? "/" : window.location.pathname;

  const Page = routes[path];

  if (!Page) {
    return Page404();
  }

  return (
    <Suspense fallback={Sussy()}>
      <TAB />
      <Page />
    </Suspense>
  );
}
