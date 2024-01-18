// mainSlice.js
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./Slices/userSlice";
import enumListSlice from "./Slices/commonSlices/enumListSlice";
//import languageSlice from "./Slices/commonSlices/languageSlice";

const rootReducer = combineReducers({
  user: userReducer,
  enumData: enumListSlice,
  //language: languageSlice,

  // Add more child slices as needed
});

export default rootReducer;
