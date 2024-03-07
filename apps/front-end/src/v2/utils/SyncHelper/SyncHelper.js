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

export async function getUserInfo(id) {
  try {
    const getUserInfo = await getIndexedDBItem(`${id}_Get`);
    if (getUserInfo) {
      return getUserInfo;
    } else {
      return {};
    }
  } catch (error) {
    console.error("Error getting IndexedDB item:", error);
    return {};
  }
}
