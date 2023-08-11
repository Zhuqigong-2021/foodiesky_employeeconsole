import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SD_Status } from "../utilities/SD";
const dishApi = createApi({
  reducerPath: "dishApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin/dish/",
    prepareHeaders: (headers: Headers) => {
      const userObj = localStorage.getItem("currentUser");
      let token;
      token = userObj && JSON.parse(userObj).token;
      // token && headers.append("Authorization", "Bearer " + token);
      token && headers.append("token", token);
    },
  }),

  tagTypes: ["dishes"],
  endpoints: (builder) => ({
    getDishes: builder.query({
      query: ({ name, page, pageSize, categoryId, status }) => ({
        url: "page",
        method: "GET",
        params: {
          ...(name && { name }),
          ...(pageSize && { pageSize }),
          ...(page && { page }),
          ...(categoryId && { categoryId }),
          ...(status && { status }),
        },
      }),
      transformResponse(apiResponse: { data: any }) {
        return {
          apiResponse,
        };
      },
      providesTags: ["dishes"],
    }),

    blockDish: builder.mutation({
      query: ({ id }) => ({
        url: "status/" + SD_Status.BLOCK,
        method: "POST",
        params: {
          id,
        },
      }),
      invalidatesTags: ["dishes"],
    }),

    enableDish: builder.mutation({
      query: ({ id }) => ({
        url: "status/" + SD_Status.ENABLE,
        method: "POST",
        params: {
          id,
        },
      }),
      invalidatesTags: ["dishes"],
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
      invalidatesTags: ["dishes"],
    }),
    getCategory: builder.query({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),

      providesTags: ["dishes"],
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
      invalidatesTags: ["dishes"],
    }),

    deleteBulkDish: builder.mutation({
      query: (ids) => ({
        url: "",
        method: "DELETE",
        params: {
          ids,
        },
      }),

      invalidatesTags: ["dishes"],
    }),
  }),
});

export const {
  useGetDishesQuery,
  useBlockDishMutation,
  useEnableDishMutation,
  useAddCategoryMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteBulkDishMutation,
} = dishApi;
export default dishApi;
