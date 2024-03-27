export function register() {
  // Check if a new version of the app is available
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(`${process.env.PUBLIC_URL}/service-worker.js`)
        .then((registration) => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    // New content is available, prompt the user to reload
                    console.log("New content is available; please refresh.");
                  } else {
                    console.log("Content is cached for offline use.");
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.error("Error during service worker registration:", error);
        });
    });
  }
}
