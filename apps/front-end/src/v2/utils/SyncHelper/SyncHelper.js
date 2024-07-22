import { facilitatorRegistryService } from "@shiksha/common-lib";
import {
  getHeaderDetails,
  getIndexedDBItem,
  setIndexedDBItem,
} from "../Helper/JSHelper";
import moment from "moment";

export async function setPrerakOfflineInfo(id) {
  try {
    const currentTime = moment().toString();
    const data = await facilitatorRegistryService.getPrerakOfflineInfo();
    let commonHeader = await getHeaderDetails();
    setIndexedDBItem(
      `${id}_${commonHeader?.program_id}_${commonHeader?.academic_year_id}_Get`,
      data?.data
    );
    setIndexedDBItem("GetSyncTime", currentTime);
    localStorage.setItem("status", data?.data?.program_faciltators?.status);
    return data?.data;
  } catch (error) {
    console.error("Error setting IndexedDB item:", error);
  }
}
export async function setPrerakUpdateInfo(id, data) {
  try {
    const currentTime = moment().toString();
    let commonHeader = await getHeaderDetails();
    setIndexedDBItem(
      `${id}_${commonHeader?.program_id}_${commonHeader?.academic_year_id}_Update`,
      data
    );
    setIndexedDBItem("UpdateSyncTime", currentTime);
  } catch (error) {
    console.error("Error setting IndexedDB item:", error);
  }
}
export async function setIpUserInfo(id) {
  try {
    const currentTime = moment().toString();
    const data = await facilitatorRegistryService.getInfo();
    let commonHeader = await getHeaderDetails();
    if (
      commonHeader?.program_id &&
      commonHeader?.academic_year_id &&
      data?.status != 401
    ) {
      setIndexedDBItem(
        `${id}_${commonHeader?.program_id}_${commonHeader?.academic_year_id}_Ip_User_Info`,
        data
      );
      setIndexedDBItem("GetSyncTime", currentTime);
    }
    return data;
  } catch (error) {
    console.error("Error setting IndexedDB item:", error);
  }
}
export async function getIpUserInfo(id) {
  try {
    let commonHeader = await getHeaderDetails();
    let ip_user_info = await getIndexedDBItem(
      `${id}_${commonHeader?.program_id}_${commonHeader?.academic_year_id}_Ip_User_Info`
    );
    return ip_user_info;
  } catch (error) {
    return null;
  }
}

export async function checkPrerakOfflineTimeInterval() {
  try {
    const timeInterval = 0.5;

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
    let commonHeader = await getHeaderDetails();
    const editRequest = await getIndexedDBItem(
      `${id}_${commonHeader?.program_id}_${commonHeader?.academic_year_id}_Ip_User_Info`
    );
    return !!editRequest;
  } catch (error) {
    console.error("Error getting IndexedDB item:", error);
    return null;
  }
}
export async function checkGetUserInfo(id) {
  try {
    let commonHeader = await getHeaderDetails();
    const editRequest = await getIndexedDBItem(
      `${id}_${commonHeader?.program_id}_${commonHeader?.academic_year_id}_Get`
    );
    return !!editRequest;
  } catch (error) {
    console.error("Error getting IndexedDB item:", error);
    return null;
  }
}
export async function checkGetUserUpdateInfo(id) {
  try {
    let commonHeader = await getHeaderDetails();
    const editRequest = await getIndexedDBItem(
      `${id}_${commonHeader?.program_id}_${commonHeader?.academic_year_id}_Update`
    );
    return !!editRequest;
  } catch (error) {
    console.error("Error getting IndexedDB item:", error);
    return null;
  }
}

export async function getUserInfo(id) {
  try {
    let commonHeader = await getHeaderDetails();
    const getUserInfo = await getIndexedDBItem(
      `${id}_${commonHeader?.program_id}_${commonHeader?.academic_year_id}_Get`
    );
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
export async function getUserInfoNull(id) {
  try {
    let commonHeader = await getHeaderDetails();
    const getUserInfo = await getIndexedDBItem(
      `${id}_${commonHeader?.program_id}_${commonHeader?.academic_year_id}_Get`
    );
    return getUserInfo;
  } catch (error) {
    return null;
  }
}

export async function getUserUpdatedInfo(id) {
  try {
    let commonHeader = await getHeaderDetails();
    const getUserInfo = await getIndexedDBItem(
      `${id}_${commonHeader?.program_id}_${commonHeader?.academic_year_id}_Update`
    );
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
export async function getUserUpdatedInfoNull(id) {
  try {
    let commonHeader = await getHeaderDetails();
    const getUserInfo = await getIndexedDBItem(
      `${id}_${commonHeader?.program_id}_${commonHeader?.academic_year_id}_Update`
    );
    return getUserInfo;
  } catch (error) {
    return null;
  }
}

export async function getOnlyChanged(MainObj, UpdateObj) {
  const NewObject = {};

  for (const key in UpdateObj) {
    if (UpdateObj.hasOwnProperty(key)) {
      if (
        typeof UpdateObj[key] === "object" &&
        !Array.isArray(UpdateObj[key])
      ) {
        const updatedSubObject = await getOnlyChanged(
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
/*export async function mergeOnlyChanged(MainObj, UpdateObj) {
  const NewObject = { ...MainObj };

  for (const key in UpdateObj) {
    if (UpdateObj.hasOwnProperty(key)) {
      if (
        typeof UpdateObj[key] === "object" &&
        !Array.isArray(UpdateObj[key])
      ) {
        NewObject[key] = await mergeOnlyChanged(MainObj[key], UpdateObj[key]);
      } else if (Array.isArray(UpdateObj[key])) {
        if (MainObj[key] && Array.isArray(MainObj[key])) {
          NewObject[key] = await Promise.all(
            MainObj[key].map(async (item, index) => {
              if (UpdateObj[key][index]) {
                return await mergeOnlyChanged(item, UpdateObj[key][index]);
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

  //experience add
  try {
    var finalObj = MainObj?.experience.concat(UpdateObj?.experience);
    //console.log("finalObj", finalObj);
    NewObject.experience = finalObj;
  } catch (e) {}

  return NewObject;
}*/

export const mergeOnlyChanged = async (obj1, obj2) => {
  const merged = { ...obj1 };

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (typeof obj2[key] === "object" && !Array.isArray(obj2[key])) {
        // If the value is an object, recursively merge it
        merged[key] = await mergeOnlyChanged(obj1[key] || {}, obj2[key]);
      } else if (Array.isArray(obj2[key])) {
        // If the value is an array, concatenate or replace it
        //merged[key] = obj1[key] ? obj1[key].concat(obj2[key]) : obj2[key];
      } else {
        // Otherwise, simply assign the value
        merged[key] = obj2[key];
      }
    }
  }

  return merged;
};

export const mergeExperiences = async (get_obj, update_obj, type) => {
  let merged = [];
  if (get_obj && get_obj.length > 0) {
    merged = get_obj;
  }
  //compair with get
  if (update_obj && update_obj.length > 0) {
    for (let i = 0; i < update_obj.length; i++) {
      let temp_update_obj = update_obj[i];
      if (type == "update" && temp_update_obj?.status == "insert") {
        merged.push(temp_update_obj);
      } else {
        if (merged.length > 0) {
          let isPush = false;
          for (let j = 0; j < merged.length; j++) {
            if (
              (type == "update" &&
                (temp_update_obj?.status == "delete" ||
                  temp_update_obj?.status == "update") &&
                temp_update_obj?.id != "" &&
                temp_update_obj?.id == merged[j]?.id) ||
              (type == "update" &&
                (temp_update_obj?.status == "delete" ||
                  temp_update_obj?.status == "update") &&
                temp_update_obj?.id == "" &&
                temp_update_obj?.unique_key == merged[j]?.unique_key) ||
              (temp_update_obj?.id != "" &&
                temp_update_obj?.id == merged[j]?.id) ||
              (temp_update_obj?.id == "" &&
                temp_update_obj?.unique_key == merged[j]?.unique_key)
            ) {
              merged[j] = temp_update_obj;
              isPush = false;
              break;
            } else {
              isPush = true;
            }
          }
          if (isPush) {
            merged.push(temp_update_obj);
          }
        } else {
          merged.push(temp_update_obj);
        }
      }
    }
  }

  return merged;
};

let payload = [];

export const StoreAttendanceToIndexDB = async (
  user,
  event_id,
  attendance,
  selectedReason
) => {
  payload = (await getIndexedDBItem("exam_attendance")) || [];
  let users = user?.user_id;
  const key = `${event_id}_${user?.user_id}`;
  const keyReason = `${event_id}_${user?.user_id}_reason`;
  const obj = {
    [key]: attendance,
    ...(selectedReason && { [keyReason]: selectedReason }),
  };
  const index = payload?.findIndex((item) => Object.keys(item)[0] === key);

  if (index !== -1) {
    // If the key exists, update its attendance
    payload[index][key] = attendance;
    if (selectedReason) {
      payload[index][keyReason] = selectedReason;
    } else {
      delete payload[index][keyReason];
    }
  } else {
    // If the key doesn't exist, add the new attendance object to the payload
    payload.push(obj);
  }
  setIndexedDBItem("exam_attendance", payload);
  return payload;
};

export const transformAttendanceResponse = async (response, date) => {
  const transformedData = response.map((item) => {
    const [eventId, userId] = Object.keys(item)[0].split("_");
    const status = Object.values(item)[0];
    const reason = Object.values(item)[1];
    return {
      event_id: parseInt(eventId),
      user_id: parseInt(userId),
      attendance_date: `${date}T12:00:00.30822+00:00`, // Replace with any fixed time
      status: status,
      ...(reason && { attendance_reason: reason }),
    };
  });
  return transformedData;
};

export const CheckUserIdInPayload = (user, learnerAttendance, event_id) => {
  const key = `${event_id}_${user?.user_id}`;
  // Find the item in learnerAttendance array with matching user_id
  const matchingItem = learnerAttendance?.find((item) => {
    const keyUserId = Object.keys(item)?.[0];
    return keyUserId === key;
  });
  // If a matching item is found, return its value, otherwise return null
  return matchingItem ? Object.values(matchingItem)[0] : null;
};
