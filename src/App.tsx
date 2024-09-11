import { Outlet, ScrollRestoration } from "react-router-dom";
import { useScrollClass } from "./shared/hooks/useScrollClass";

function App() {
  useScrollClass();

  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

export default App;
