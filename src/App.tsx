import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useScrollClass } from "./shared/hooks/useScrollClass";

function App() {
  useScrollClass();

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
