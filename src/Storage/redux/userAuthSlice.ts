import { createSlice } from "@reduxjs/toolkit";
import { userModel } from "../../interfaces";

export const emptyUserState: userModel = {
  name: "",
  id: "",
  username: "",
  token: "",
};

export const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: emptyUserState,
  reducers: {
    setLoggedInUser: (state, action) => {
      state.name = action.payload.name;
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.token = action.payload.token;
    },
  },
});

export const { setLoggedInUser } = userAuthSlice.actions;
export const userAuthReducer = userAuthSlice.reducer;
