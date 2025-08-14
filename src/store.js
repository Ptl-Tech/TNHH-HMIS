import { thunk } from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers/RootReducer";

const initialState = {};

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

export default store;
