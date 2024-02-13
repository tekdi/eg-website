import React, { useState, useLayoutEffect } from "react";
import { changeLanguage } from "i18next";

export function getWindowSize(maxWidth = "1080") {
  const [size, setSize] = useState([]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize([
        window.innerWidth > maxWidth ? maxWidth : "100%",
        window.innerHeight > window.outerHeight
          ? window.outerHeight
          : window.innerHeight,
      ]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

export function setLanguage(code) {
  localStorage.setItem("lang", code);
  changeLanguage(code);
}
export function getLanguage() {
  return localStorage.getItem("lang");
}

export default getWindowSize;
