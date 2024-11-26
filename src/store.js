// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk"; // Correct import for redux-thunk
import {rootReducer} from "./reducers/RootReducer";
import {jwtDecode} from "jwt-decode";

const userInfoFromStorage = localStorage.getItem("userInfo") 
  ? JSON.parse(localStorage.getItem("userInfo")) 
  : null;

  
  const initialLoginState = userInfoFromStorage 
  ? { isLoggedIn: true, sessionToken: userInfoFromStorage.sessionToken, branchCode: userInfoFromStorage.branchCode } 
  : { isLoggedIn: false, sessionToken: null, branchCode: null };

const initialOtpState = userInfoFromStorage && userInfoFromStorage.otpVerified 
  ? { isVerified: true, portalSession: userInfoFromStorage.portal_Session_Token, staffNo: userInfoFromStorage.no }
  : { isVerified: false, portalSession: null, staffNo: null };


// Define initial state
const initialState = {
  userLogin: {
    ...initialLoginState, // Login state
  },
  userOtpVerification: {
    ...initialOtpState, // OTP verification and portal session state
  },
};


// Configure middleware
const mymiddleware = [thunk];

// Configure store
const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(mymiddleware),
  devTools: true,
});

export default store;