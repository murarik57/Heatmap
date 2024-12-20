import React from "react";
import ReactDOM from "react-dom/client";
import HeatMap from "./HeatMap";
import FintiPlugin from "./FintiPlugin";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <HeatMap /> */}
    <FintiPlugin />
  </React.StrictMode>
);
