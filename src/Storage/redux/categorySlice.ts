import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { categoryModel } from "../../interfaces";
interface CategoryState {
  categories: categoryModel[];
}
export const emptyCategory: CategoryState = {
  categories: [],
};

export const categorySlice = createSlice({
  name: "category",
  initialState: emptyCategory,
  reducers: {
    setCurrentCategoriesArr: (
      state,
      action: PayloadAction<categoryModel[]>
    ) => {
      state.categories = action.payload;
    },
  },
});

export const { setCurrentCategoriesArr } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
