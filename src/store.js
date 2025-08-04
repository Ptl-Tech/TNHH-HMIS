import { thunk } from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers/RootReducer";

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const otpStateFromStorage = JSON.parse(
  localStorage.getItem("otpVerifyState")
) || {
  isVerified: false,
  portalSession: null,
  staffNo: null,
};

const initialLoginState = userInfoFromStorage
  ? {
      isLoggedIn: true,
      sessionToken: userInfoFromStorage.sessionToken,
      branchCode: userInfoFromStorage.branchCode,
    }
  : { isLoggedIn: false, sessionToken: null, branchCode: null };

const initialState = {
  userLogin: initialLoginState,
  otpVerify: otpStateFromStorage,
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(thunk),
  devTools: process.env.NODE_ENV !== "production",
});

store.subscribe(() => {
  const { otpVerify } = store.getState();
  localStorage.setItem("otpVerifyState", JSON.stringify(otpVerify));
});

export default store;
