import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

if (!document.querySelector('link[rel="manifest"]')) {
  const manifest = document.createElement("link");
  manifest.rel = "manifest";
  manifest.href = "/manifest.webmanifest";
  document.head.appendChild(manifest);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
