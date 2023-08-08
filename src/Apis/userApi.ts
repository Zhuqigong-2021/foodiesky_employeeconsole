import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SD_Status } from "../utilities/SD";
const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin/employee/",
    prepareHeaders: (headers: Headers) => {
      const userObj = localStorage.getItem("currentUser");
      let token;
      token = userObj && JSON.parse(userObj).token;
      // token && headers.append("Authorization", "Bearer " + token);
      token && headers.append("token", token);
    },
  }),

  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ name, page, pageSize }) => ({
        url: "page",
        method: "GET",
        params: {
          ...(name && { name }),
          ...(pageSize && { pageSize }),
          ...(page && { page }),
        },
      }),
      transformResponse(apiResponse: { data: any }) {
        return {
          apiResponse,
          //   totalRecords: meta.response.headers.get("X-Pagination"),
        };
      },
      providesTags: ["Users"],
    }),

    blockUser: builder.mutation({
      query: ({ id }) => ({
        url: "status/" + SD_Status.BLOCK,
        method: "POST",
        params: {
          id,
        },
      }),
      invalidatesTags: ["Users"],
    }),

    enableUser: builder.mutation({
      query: ({ id }) => ({
        url: "status/" + SD_Status.ENABLE,
        method: "POST",
        params: {
          id,
        },
      }),
      invalidatesTags: ["Users"],
    }),

    addUser: builder.mutation({
      query: (newEmployee) => ({
        url: "",
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: newEmployee,
      }),
      invalidatesTags: ["Users"],
    }),
    getUser: builder.query({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),

      providesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: (updatedEmployee) => ({
        url: "",
        method: "Put",
        headers: {
          "Content-type": "application/json",
        },
        body: updatedEmployee,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useBlockUserMutation,
  useEnableUserMutation,
  useAddUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} = userApi;
export default userApi;
