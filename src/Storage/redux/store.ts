import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../Apis";

import { userAuthReducer } from "./userAuthSlice";
import weatherApi from "../../Apis/weatherApi";
import userApi from "../../Apis/userApi";
import categoryApi from "../../Apis/categoryApi";

const store = configureStore({
  reducer: {
    userAuthStore: userAuthReducer,
    [authApi.reducerPath]: authApi.reducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(weatherApi.middleware)
      .concat(userApi.middleware)
      .concat(categoryApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
