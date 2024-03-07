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
  const NewObject = { ...MainObj };

  for (const key in UpdateObj) {
    if (UpdateObj.hasOwnProperty(key)) {
      if (
        typeof UpdateObj[key] === "object" &&
        !Array.isArray(UpdateObj[key])
      ) {
        NewObject[key] = await updateOnlyChangedProperties(
          MainObj[key],
          UpdateObj[key]
        );
      } else if (Array.isArray(UpdateObj[key])) {
        if (MainObj[key] && Array.isArray(MainObj[key])) {
          NewObject[key] = await Promise.all(
            MainObj[key].map(async (item, index) => {
              if (UpdateObj[key][index]) {
                return await updateOnlyChangedProperties(
                  item,
                  UpdateObj[key][index]
                );
              }
              return item;
            })
          );
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

  return NewObject;
}
