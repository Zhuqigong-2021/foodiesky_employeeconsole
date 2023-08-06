import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../Apis";

import { userAuthReducer } from "./userAuthSlice";

const store = configureStore({
  reducer: {
    userAuthStore: userAuthReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
