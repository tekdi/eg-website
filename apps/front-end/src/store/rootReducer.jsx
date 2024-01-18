// mainSlice.js
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./Slices/userSlice";
import IpUserInfoSlice from "./Slices/ipUserInfoSlice";
import enumListSlice from "./Slices/commonSlices/enumListSlice";
//import languageSlice from "./Slices/commonSlices/languageSlice";

const rootReducer = combineReducers({
  user: userReducer,
  enumData: enumListSlice,
  ipUserInfo: IpUserInfoSlice,
  //language: languageSlice,

  // Add more child slices as needed
});

export default rootReducer;
