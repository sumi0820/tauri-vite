import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import React from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";

import { useEagerConnect, useInactiveListener } from "./hooks";
// import {
//   injected,
//   network,
//   walletconnect,
//   walletlink,
//   ledger,
//   trezor,
//   lattice,
//   frame,
//   authereum,
//   fortmatic,
//   magic,
//   portis,
//   torus,
// } from "./connectors";
import { Spinner } from "./components/Spinner";
// import TrezorConnect from "@trezor/connect-web";
import { WebviewWindow } from "@tauri-apps/api/window";
import TrezorConnect from "@trezor/connect-web";

enum ConnectorNames {
  Injected = "Injected",
  Network = "Network",
  WalletConnect = "WalletConnect",
  WalletLink = "WalletLink",
  Ledger = "Ledger",
  Trezor = "Trezor",
  Lattice = "Lattice",
  Frame = "Frame",
  Authereum = "Authereum",
  Fortmatic = "Fortmatic",
  Magic = "Magic",
  Portis = "Portis",
  Torus = "Torus",
}

// const connectorsByName: { [connectorName in ConnectorNames]: any } = {
//   [ConnectorNames.Injected]: injected,
//   [ConnectorNames.Network]: network,
//   [ConnectorNames.WalletConnect]: walletconnect,
//   [ConnectorNames.WalletLink]: walletlink,
//   [ConnectorNames.Ledger]: ledger,
//   [ConnectorNames.Trezor]: trezor,
//   [ConnectorNames.Lattice]: lattice,
//   [ConnectorNames.Frame]: frame,
//   [ConnectorNames.Authereum]: authereum,
//   [ConnectorNames.Fortmatic]: fortmatic,
//   [ConnectorNames.Magic]: magic,
//   [ConnectorNames.Portis]: portis,
//   [ConnectorNames.Torus]: torus,
// };

// function getErrorMessage(error: Error) {
//   if (error instanceof NoEthereumProviderError) {
//     return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
//   } else if (error instanceof UnsupportedChainIdError) {
//     return "You're connected to an unsupported network.";
//   } else if (
//     error instanceof UserRejectedRequestErrorInjected ||
//     error instanceof UserRejectedRequestErrorWalletConnect ||
//     error instanceof UserRejectedRequestErrorFrame
//   ) {
//     return "Please authorize this website to access your Ethereum account.";
//   } else {
//     console.error(error);
//     return "An unknown error occurred. Check the console for more details.";
//   }
// }

// function ChainId() {
//   const { chainId } = useWeb3React();

//   return (
//     <>
//       <span>Chain Id</span>
//       <span role="img" aria-label="chain">
//         ⛓
//       </span>
//       <span>{chainId ?? ""}</span>
//     </>
//   );
// }

// function BlockNumber() {
//   const { chainId, library } = useWeb3React();

//   const [blockNumber, setBlockNumber] = React.useState<number>();
//   React.useEffect((): any => {
//     if (!!library) {
//       let stale = false;

//       library
//         .getBlockNumber()
//         .then((blockNumber: number) => {
//           if (!stale) {
//             setBlockNumber(blockNumber);
//           }
//         })
//         .catch(() => {
//           if (!stale) {
//             setBlockNumber(undefined);
//           }
//         });

//       const updateBlockNumber = (blockNumber: number) => {
//         setBlockNumber(blockNumber);
//       };
//       library.on("block", updateBlockNumber);

//       return () => {
//         stale = true;
//         library.removeListener("block", updateBlockNumber);
//         setBlockNumber(undefined);
//       };
//     }
//   }, [library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

//   return (
//     <>
//       <span>Block Number</span>
//       <span role="img" aria-label="numbers">
//         🔢
//       </span>
//       <span>{blockNumber === null ? "Error" : blockNumber ?? ""}</span>
//     </>
//   );
// }

// function Account() {
//   const { account } = useWeb3React();

//   return (
//     <>
//       <span>Account</span>
//       <span role="img" aria-label="robot">
//         🤖
//       </span>
//       <span>
//         {account === null
//           ? "-"
//           : account
//           ? `${account.substring(0, 6)}...${account.substring(
//               account.length - 4
//             )}`
//           : ""}
//       </span>
//     </>
//   );
// }

// function Balance() {
//   const { account, library, chainId } = useWeb3React();

//   const [balance, setBalance] = React.useState();
//   React.useEffect((): any => {
//     if (!!account && !!library) {
//       let stale = false;

//       library
//         .getBalance(account)
//         .then((balance: any) => {
//           if (!stale) {
//             setBalance(balance);
//           }
//         })
//         .catch(() => {
//           if (!stale) {
//             setBalance(undefined);
//           }
//         });

//       return () => {
//         stale = true;
//         setBalance(undefined);
//       };
//     }
//   }, [account, library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

//   return (
//     <>
//       <span>Balance</span>
//       <span role="img" aria-label="gold">
//         💰
//       </span>
//       <span>
//         {balance === null ? "Error" : balance ? `Ξ${formatEther(balance)}` : ""}
//       </span>
//     </>
//   );
// }

// function Header() {
//   const { active, error } = useWeb3React();

//   return (
//     <>
//       <h1 style={{ margin: "1rem", textAlign: "right" }}>
//         {active ? "🟢" : error ? "🔴" : "🟠"}
//       </h1>
//       <h3
//         style={{
//           display: "grid",
//           gridGap: "1rem",
//           gridTemplateColumns: "1fr min-content 1fr",
//           maxWidth: "20rem",
//           lineHeight: "2rem",
//           margin: "auto",
//         }}
//       >
//         <ChainId />
//         <BlockNumber />
//         <Account />
//         <Balance />
//       </h3>
//     </>
//   );
// }

// function Home() {
//   const context = useWeb3React<Web3Provider>();
//   const {
//     connector,
//     library,
//     chainId,
//     account,
//     activate,
//     deactivate,
//     active,
//     error,
//   } = context;

//   // handle logic to recognize the connector currently being activated
//   const [activatingConnector, setActivatingConnector] = React.useState<any>();
//   React.useEffect(() => {
//     if (activatingConnector && activatingConnector === connector) {
//       setActivatingConnector(undefined);
//     }
//   }, [activatingConnector, connector]);

//   // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
//   const triedEager = useEagerConnect();

//   // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
//   useInactiveListener(!triedEager || !!activatingConnector);

//   return (
//     <>
//       <Header />
//       <hr style={{ margin: "2rem" }} />
//       <div
//         style={{
//           display: "grid",
//           gridGap: "1rem",
//           gridTemplateColumns: "1fr 1fr",
//           maxWidth: "20rem",
//           margin: "auto",
//         }}
//       >
//         {Object.keys(connectorsByName).map((name) => {
//           const currentConnector = connectorsByName[name];
//           const activating = currentConnector === activatingConnector;
//           const connected = currentConnector === connector;
//           const disabled =
//             !triedEager || !!activatingConnector || connected || !!error;

//           return (
//             <button
//               style={{
//                 height: "3rem",
//                 borderRadius: "1rem",
//                 borderColor: activating
//                   ? "orange"
//                   : connected
//                   ? "green"
//                   : "unset",
//                 cursor: disabled ? "unset" : "pointer",
//                 position: "relative",
//               }}
//               disabled={disabled}
//               key={name}
//               onClick={() => {
//                 setActivatingConnector(currentConnector);
//                 activate(connectorsByName[name], (error) => {
//                   if (error) {
//                     setActivatingConnector(undefined);
//                   }
//                 });
//               }}
//             >
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "0",
//                   left: "0",
//                   height: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   color: "black",
//                   margin: "0 0 0 1rem",
//                 }}
//               >
//                 {activating && (
//                   <Spinner
//                     color={"black"}
//                     style={{ height: "25%", marginLeft: "-1rem" }}
//                   />
//                 )}
//                 {connected && (
//                   <span role="img" aria-label="check">
//                     ✅
//                   </span>
//                 )}
//               </div>
//               {name}
//             </button>
//           );
//         })}
//       </div>
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         {(active || error) && (
//           <button
//             style={{
//               height: "3rem",
//               marginTop: "2rem",
//               borderRadius: "1rem",
//               borderColor: "red",
//               cursor: "pointer",
//             }}
//             onClick={() => {
//               deactivate();
//             }}
//           >
//             Deactivate
//           </button>
//         )}

//         {!!error && (
//           <h4 style={{ marginTop: "1rem", marginBottom: "0" }}>
//             {getErrorMessage(error)}
//           </h4>
//         )}
//       </div>

//       <hr style={{ margin: "2rem" }} />
//       <button
//         style={{ margin: "2rem" }}
//         type="button"
//         onClick={async function openNewWindow() {
//           try {
//             const WebviewWindow = await (
//               await import("@tauri-apps/api/window")
//             ).WebviewWindow;

//             new WebviewWindow("theUniqueLabel", {
//               url: "https://www.youtube.com/watch?v=gRlfvBkkZs0",
//             });
//             console.log("clicked");
//           } catch (error) {
//             console.log(error);
//           }
//         }}
//       >
//         test
//       </button>
//       <div
//         style={{
//           display: "grid",
//           gridGap: "1rem",
//           gridTemplateColumns: "fit-content",
//           maxWidth: "20rem",
//           margin: "auto",
//         }}
//       >
//         {!!(library && account) && (
//           <button
//             style={{
//               height: "3rem",
//               borderRadius: "1rem",
//               cursor: "pointer",
//             }}
//             onClick={() => {
//               library
//                 .getSigner(account)
//                 .signMessage("👋")
//                 .then((signature: any) => {
//                   window.alert(`Success!\n\n${signature}`);
//                 })
//                 .catch((error: any) => {
//                   window.alert(
//                     "Failure!" +
//                       (error && error.message ? `\n\n${error.message}` : "")
//                   );
//                 });
//             }}
//           >
//             Sign Message
//           </button>
//         )}
//         {!!(
//           connector === connectorsByName[ConnectorNames.Network] && chainId
//         ) && (
//           <button
//             style={{
//               height: "3rem",
//               borderRadius: "1rem",
//               cursor: "pointer",
//             }}
//             onClick={() => {
//               (connector as any).changeChainId(chainId === 1 ? 4 : 1);
//             }}
//           >
//             Switch Networks
//           </button>
//         )}
//         {connector === connectorsByName[ConnectorNames.WalletConnect] && (
//           <button
//             style={{
//               height: "3rem",
//               borderRadius: "1rem",
//               cursor: "pointer",
//             }}
//             onClick={() => {
//               (connector as any).close();
//             }}
//           >
//             Kill WalletConnect Session
//           </button>
//         )}
//         {connector === connectorsByName[ConnectorNames.WalletLink] && (
//           <button
//             style={{
//               height: "3rem",
//               borderRadius: "1rem",
//               cursor: "pointer",
//             }}
//             onClick={() => {
//               (connector as any).close();
//             }}
//           >
//             Kill WalletLink Session
//           </button>
//         )}
//         {connector === connectorsByName[ConnectorNames.Fortmatic] && (
//           <button
//             style={{
//               height: "3rem",
//               borderRadius: "1rem",
//               cursor: "pointer",
//             }}
//             onClick={() => {
//               (connector as any).close();
//             }}
//           >
//             Kill Fortmatic Session
//           </button>
//         )}
//         {connector === connectorsByName[ConnectorNames.Magic] && (
//           <button
//             style={{
//               height: "3rem",
//               borderRadius: "1rem",
//               cursor: "pointer",
//             }}
//             onClick={() => {
//               (connector as any).close();
//             }}
//           >
//             Kill Magic Session
//           </button>
//         )}
//         {connector === connectorsByName[ConnectorNames.Portis] && (
//           <>
//             {chainId !== undefined && (
//               <button
//                 style={{
//                   height: "3rem",
//                   borderRadius: "1rem",
//                   cursor: "pointer",
//                 }}
//                 onClick={() => {
//                   (connector as any).changeNetwork(chainId === 1 ? 100 : 1);
//                 }}
//               >
//                 Switch Networks
//               </button>
//             )}
//             <button
//               style={{
//                 height: "3rem",
//                 borderRadius: "1rem",
//                 cursor: "pointer",
//               }}
//               onClick={() => {
//                 (connector as any).close();
//               }}
//             >
//               Kill Portis Session
//             </button>
//           </>
//         )}
//         {connector === connectorsByName[ConnectorNames.Torus] && (
//           <button
//             style={{
//               height: "3rem",
//               borderRadius: "1rem",
//               cursor: "pointer",
//             }}
//             onClick={() => {
//               (connector as any).close();
//             }}
//           >
//             Kill Torus Session
//           </button>
//         )}
//       </div>
//     </>
//   );
// }

function App() {
  const [count, setCount] = useState(0);

  const trezor = async () => {

  TrezorConnect.manifest({
    email: "developer@xyz.com",
    appUrl: "https://mydashwallet.org",
  });

  const publicKey = await TrezorConnect.getPublicKey({
    path: "m/44'/60'/0'/0'",
    coin: "tGOR",
  });
  // openNewWindow();
  // async function openNewWindow() {
  //   try {
  //     const WebviewWindow = await (
  //       await import("@tauri-apps/api/window")
  //     ).WebviewWindow;

  //     const publicKey = await TrezorConnect.getPublicKey({
  //       path: "m/44'/60'/0'/0'",
  //       coin: "tGOR",
  //     });
  //     // new WebviewWindow("external", {
  //     //   url: "https://connect.trezor.io/9/popup.html",
  //     //   // url: "https://www.youtube.com/",
  //     // });
  //   } catch (error) {
  //     console.log(error);
  //   }
  };
  
  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button onClick={trezor}>Trezor</button>
    </div>
  );
}

export default App;
