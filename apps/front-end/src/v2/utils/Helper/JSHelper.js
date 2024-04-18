import React, { useState, useLayoutEffect } from "react";
import { changeLanguage } from "i18next";
import { get, set } from "idb-keyval";
import {
  getSelectedAcademicYear,
  getSelectedProgramId,
} from "@shiksha/common-lib";

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

export const fetchFileUrlAsBlob = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch file");
    }
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error fetching or converting the file:", error);
  }
};

export async function base64toBlob(
  base64Data,
  contentType = "application/pdf"
) {
  const byteCharacters = atob(base64Data.split(",")[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

export const getHeaderDetails = async () => {
  let commonHeader = {};
  let academic_year_id = null;
  let program_id = null;
  try {
    let academic_year = await getSelectedAcademicYear();
    academic_year_id = academic_year?.academic_year_id;
  } catch (e) {}
  try {
    let program = await getSelectedProgramId();
    program_id = program?.program_id;
  } catch (e) {}
  commonHeader = {
    academic_year_id: academic_year_id,
    program_id: program_id,
  };
  return commonHeader;
};

export const getFileTypeFromBase64 = async (base64String) => {
  // Extract base64 header which contains the file type
  // Split the base64 string by comma
  if (base64String) {
    //console.log("base64String", base64String);
    const parts = base64String.split(",");

    // Extract the header portion containing the file type
    const header = parts[0];

    // Extract the file type from the header
    const fileType = header.split(":")[1].split(";")[0];

    return fileType;
  }
  return null;
};

export function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result;
      resolve(base64String);
    };

    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
}

export function arraysAreEqual(array1, array2) {
  // Check if arrays have the same length
  if (array1.length !== array2.length) {
    return false;
  }

  // Iterate over the elements of the arrays and compare them
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      // If corresponding elements are not equal, arrays are not equal
      return false;
    }
  }

  // If all corresponding elements are equal, arrays are equal
  return true;
}

export function generateUniqueRandomNumber() {
  // Get the current timestamp
  const timestamp = Date.now().toString();

  // Generate a random number between 0 and 9999
  const randomNumber = Math.floor(Math.random() * 10000);

  // Concatenate the timestamp with the random number
  const uniqueNumber = timestamp + randomNumber;

  return parseInt(uniqueNumber);
}
