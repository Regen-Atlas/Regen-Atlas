import { Outlet } from "react-router-dom";
import { useScrollClass } from "./shared/hooks/useScrollClass";

function App() {
  useScrollClass();

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
