/* eslint-disable no-restricted-globals */
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst } from "workbox-strategies";

// Import Workbox from CDN
importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js");

// Claim clients immediately
clientsClaim();

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Precache files
precacheAndRoute(self.__WB_MANIFEST);

// Use NetworkFirst strategy for HTML files to ensure fresh content
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages-cache",
    plugins: [
      new ExpirationPlugin({ maxEntries: 50 })
    ],
  })
);

// Use StaleWhileRevalidate for images and other assets
registerRoute(
  ({ request }) => request.destination === "image",
  new StaleWhileRevalidate({
    cacheName: "images-cache",
    plugins: [
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// Default fallback for other requests
registerRoute(
  ({ request }) => request.destination !== "image" && request.mode !== "navigate",
  new StaleWhileRevalidate({
    cacheName: "default-cache",
    plugins: [
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);
