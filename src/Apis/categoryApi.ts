import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SD_Status } from "../utilities/SD";
const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin/category/",
    prepareHeaders: (headers: Headers) => {
      const userObj = localStorage.getItem("currentUser");
      let token;
      token = userObj && JSON.parse(userObj).token;
      // token && headers.append("Authorization", "Bearer " + token);
      token && headers.append("token", token);
    },
  }),

  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ name, page, pageSize, type = "" }) => ({
        url: "page",
        method: "GET",
        params: {
          ...(name && { name }),
          ...(pageSize && { pageSize }),
          ...(page && { page }),
          ...(type && { type }),
        },
      }),
      transformResponse(apiResponse: { data: any }) {
        return {
          apiResponse,
          //   totalRecords: meta.response.headers.get("X-Pagination"),
        };
      },
      providesTags: ["Categories"],
    }),

    getAllCategories: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),

      providesTags: ["Categories"],
    }),

    blockCategory: builder.mutation({
      query: ({ id }) => ({
        url: "status/" + SD_Status.BLOCK,
        method: "POST",
        params: {
          id,
        },
      }),
      invalidatesTags: ["Categories"],
    }),

    enableCategory: builder.mutation({
      query: ({ id }) => ({
        url: "status/" + SD_Status.ENABLE,
        method: "POST",
        params: {
          id,
        },
      }),
      invalidatesTags: ["Categories"],
    }),

    addCategory: builder.mutation({
      query: (newCategory) => ({
        url: "",
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: newCategory,
      }),
      invalidatesTags: ["Categories"],
    }),
    getCategory: builder.query({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),

      providesTags: ["Categories"],
    }),
    updateCategory: builder.mutation({
      query: (updatedCategory) => ({
        url: "",
        method: "Put",
        headers: {
          "Content-type": "application/json",
        },
        body: updatedCategory,
      }),
      invalidatesTags: ["Categories"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: "",
        method: "DELETE",
        params: {
          id,
        },
      }),

      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoriesQuery,
  useBlockCategoryMutation,
  useEnableCategoryMutation,
  useAddCategoryMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
export default categoryApi;
