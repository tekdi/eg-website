import { facilitatorRegistryService } from "@shiksha/common-lib";
import { getIndexedDBItem, setIndexedDBItem } from "../Helper/JSHelper";
import moment from "moment";

export async function setPrerakOfflineInfo(id) {
  try {
    const currentTime = moment().toString();
    const data = await facilitatorRegistryService.getPrerakOfflineInfo();
    setIndexedDBItem(`${id}_Get`, data?.data);
    setIndexedDBItem("GetSyncTime", currentTime);
  } catch (error) {
    console.error("Error setting IndexedDB item:", error);
  }
}
export async function setIpUserInfo(id) {
  try {
    const currentTime = moment().toString();
    const data = await facilitatorRegistryService.getInfo();
    setIndexedDBItem(`${id}_Ip_User_Info`, data);
    setIndexedDBItem("GetSyncTime", currentTime);
    return data;
  } catch (error) {
    console.error("Error setting IndexedDB item:", error);
  }
}

export async function checkPrerakOfflineTimeInterval() {
  try {
    const timeInterval = 30;

    const GetSyncTime = await getIndexedDBItem("GetSyncTime");

    if (GetSyncTime) {
      const timeDiff = moment.duration(moment().diff(GetSyncTime)).asMinutes();
      return timeDiff >= timeInterval;
    }
  } catch (error) {
    console.error("Error setting IndexedDB item:", error);
  }
}

export async function checkIpUserInfo(id) {
  try {
    const editRequest = await getIndexedDBItem(`${id}_Ip_User_Info`);
    return !!editRequest;
  } catch (error) {
    console.error("Error getting IndexedDB item:", error);
    return null;
  }
}

export async function updateOnlyChangedProperties(MainObj, UpdateObj) {
  const NewObject = {};

  for (const key in UpdateObj) {
    if (UpdateObj.hasOwnProperty(key)) {
      if (
        typeof UpdateObj[key] === "object" &&
        !Array.isArray(UpdateObj[key])
      ) {
        const updatedSubObject = await updateOnlyChangedProperties(
          MainObj[key],
          UpdateObj[key]
        );
        if (Object.keys(updatedSubObject).length > 0) {
          NewObject[key] = updatedSubObject;
        }
      } else if (Array.isArray(UpdateObj[key])) {
        if (MainObj[key] && Array.isArray(MainObj[key])) {
          const updatedArray = MainObj[key].map((item) => {
            const updatedItem = UpdateObj[key].find(
              (updated) => updated.id === item.id
            );
            return updatedItem ? updatedItem : item;
          });
          NewObject[key] = updatedArray;
        } else {
          NewObject[key] = UpdateObj[key];
        }
      } else {
        if (MainObj[key] !== UpdateObj[key]) {
          NewObject[key] = UpdateObj[key];
        }
      }
    }
  }

  // Merge arrays and remove duplicates
  for (const key in MainObj) {
    if (
      MainObj.hasOwnProperty(key) &&
      Array.isArray(MainObj[key]) &&
      UpdateObj[key]
    ) {
      const mergedArray = [
        ...MainObj[key].filter(
          (item) => !UpdateObj[key].some((updated) => updated.id === item.id)
        ),
        ...UpdateObj[key],
      ];
      NewObject[key] = mergedArray;
    }
  }

  return NewObject;
}
