import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./Slices/userSlice";
import IpUserInfoSlice from "./Slices/ipUserInfoSlice";
import enumListSlice from "./Slices/commonSlices/enumListSlice";
import LearnerSlice from "./Slices/LearnerSlice";

const rootReducer = combineReducers({
  user: userReducer,
  enumData: enumListSlice,
  ipUserInfo: IpUserInfoSlice,
  lernerData: LearnerSlice,
});

export default rootReducer;
