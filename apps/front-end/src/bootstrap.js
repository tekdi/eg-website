import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// Register service worker
serviceWorkerRegistration.register({
  onUpdate: registration => {
    // Notify user about new updates
    if (window.confirm("New version available! Would you like to update?")) {
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
        registration.waiting.addEventListener("statechange", (e) => {
          if (e.target.state === "activated") {
            window.location.reload();
          }
        });
      }
    }
  }
});

reportWebVitals();
