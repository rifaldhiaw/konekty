import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GlobalStateProvider } from "./components/MachineProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <GlobalStateProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GlobalStateProvider>
);
