import React from "react";
import { get, set } from "idb-keyval";

const PrerakMainPayload = async ({ mainData }) => {
  const obj2 = await get("payload");
  const mergeObjects = (mainData, obj2) => {
    const mergedObj = { ...mainData };

    for (const key in obj2) {
      if (mainData.hasOwnProperty(key)) {
        if (key === "work_experience_details" && obj2[key].experience) {
          // If the property is work_experience_details and contains experience array
          mergedObj[key].experience.push(...mainData[key].experience);
        } else if (typeof obj2[key] === "object" && obj2[key] !== null) {
          // If the property is an object, recursively call mergeObjects
          mergedObj[key] = mergeObjects(mainData[key], obj2[key]);
        } else if (mainData[key] !== obj2[key]) {
          // If the property exists in both objects and their values are different, update the value
          mergedObj[key] = mainData[key];
        }
      } else {
        // If the property only exists in obj2, add it to the merged object
        mergedObj[key] = obj2[key];
      }
    }
    set("payload", mergedObj);
    return mergedObj;
  };

  // Merge the objects
  const mergedObject = mergeObjects(mainData, obj2);

  console.log(mergedObject);

  return <div>PrerakMainPayload</div>;
};

export default PrerakMainPayload;
