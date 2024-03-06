import React, { useState, useLayoutEffect } from "react";
import { changeLanguage } from "i18next";
import { get, set } from "idb-keyval";

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
export function getUserId() {
  return localStorage.getItem("id");
}

export default getWindowSize;

//indexed db key-val get/set functions

export async function setIndexedDBItem(key, value) {
  try {
    await set(key, value);
  } catch (error) {
    console.error("Error setting IndexedDB item:", error);
  }
}

export async function getIndexedDBItem(key) {
  try {
    return await get(key);
  } catch (error) {
    console.error("Error getting IndexedDB item:", error);
    return null;
  }
}
export async function checkEnumListPresent(key) {
  try {
    const enums = await getIndexedDBItem("enums");
    return !!enums;
  } catch (error) {
    console.error("Error getting IndexedDB item:", error);
    return null;
  }
}
export async function checkQulificationPresent(key) {
  try {
    const qualification = await getIndexedDBItem("qualification");
    return !!qualification;
  } catch (error) {
    console.error("Error getting IndexedDB item:", error);
    return null;
  }
}
export async function checkEditRequestPresent(key) {
  try {
    const editRequest = await getIndexedDBItem("editRequest");
    return !!editRequest;
  } catch (error) {
    console.error("Error getting IndexedDB item:", error);
    return null;
  }
}
