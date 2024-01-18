// mainSlice.js
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./Slices/userSlice";
import dataTableReducer from "./Slices/dataTableSlice";
import IpUserInfoSlice from "./Slices/ipUserInfoSlice";

const rootReducer = combineReducers({
  user: userReducer,
  dataTable: dataTableReducer,
  ipUserInfo: IpUserInfoSlice,
  // Add more child slices as needed
});

export default rootReducer;
