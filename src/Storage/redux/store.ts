import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../Apis";

import { userAuthReducer } from "./userAuthSlice";
import weatherApi from "../../Apis/weatherApi";

const store = configureStore({
  reducer: {
    userAuthStore: userAuthReducer,
    [authApi.reducerPath]: authApi.reducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(weatherApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
