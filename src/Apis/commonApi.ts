import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const commonApi = createApi({
  reducerPath: "commonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers: Headers) => {
      const userObj = localStorage.getItem("currentUser");
      let token;
      token = userObj && JSON.parse(userObj).token;
      token && headers.append("token", token);
    },
  }),

  tagTypes: ["Upload"],
  endpoints: (builder) => ({
    uploadImage: builder.mutation<string, FormData>({
      query: (file) => ({
        url: "/admin/common/upload",
        method: "POST",
        headers: {
          "Content-type": "multipart/form-data",
          // Authorization:
          //   "Bear eyJhbGciOiJIUzI1NiJ9.eyJlbXBJZCI6MSwiZXhwIjoxNjkxOTUyNDQ3fQ.wtjBy9miYSZ889huJyq1Djcy0rD_n7FVfGXUsEsynIc",
        },
        body: file,
      }),
      invalidatesTags: ["Upload"],
    }),
  }),
});

export const { useUploadImageMutation } = commonApi;
export default commonApi;
