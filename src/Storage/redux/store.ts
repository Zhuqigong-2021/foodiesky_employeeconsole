import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../Apis";

import { userAuthReducer } from "./userAuthSlice";
import weatherApi from "../../Apis/weatherApi";
import userApi from "../../Apis/userApi";
import categoryApi from "../../Apis/categoryApi";
import dishApi from "../../Apis/dishApi";
import { categoryReducer } from "./categorySlice";
import commonApi from "../../Apis/commonApi";
import shopApi from "../../Apis/shopApi";

const store = configureStore({
  reducer: {
    userAuthStore: userAuthReducer,
    categoryStore: categoryReducer,
    [authApi.reducerPath]: authApi.reducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [dishApi.reducerPath]: dishApi.reducer,
    [commonApi.reducerPath]: commonApi.reducer,
    [shopApi.reducerPath]: shopApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(weatherApi.middleware)
      .concat(userApi.middleware)
      .concat(categoryApi.middleware)
      .concat(dishApi.middleware)
      .concat(commonApi.middleware)
      .concat(shopApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
