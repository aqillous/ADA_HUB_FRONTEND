import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@fontsource/lato/400.css"; // Regular
import "@fontsource/lato/700.css"; // Bold
import "@fontsource/lato/900.css"; // Very Bold

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
