import { getUserInfo } from "../SyncHelper/SyncHelper";

export async function getOnboardingData(id) {
  try {
    let userInfo = await getUserInfo(id);
    if (userInfo) {
      console.log(userInfo);
      let format_result = {
        first_name: userInfo?.users?.first_name,
        last_name: userInfo?.users?.last_name,
        middle_name: userInfo?.users?.middle_name,
        dob: userInfo?.users?.dob,
      };
      return format_result;
    } else {
      return {};
    }
  } catch (error) {
    return {};
  }
}
