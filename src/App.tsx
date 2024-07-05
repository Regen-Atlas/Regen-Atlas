import { ConnectKitButton } from "connectkit";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import Header from "./Header";
import { Outlet } from "react-router-dom";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <>
      <Header />
      <Outlet />
      {/* <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        <ConnectKitButton />
        <div>{status}</div>
        <div>{error?.message}</div>
      </div> */}
    </>
  );
}

export default App;
