import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin/employee/",
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (userCredentials) => ({
        url: "login",
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: userCredentials,
      }),
    }),
  }),
});

export const { useLoginUserMutation } = authApi;
export default authApi;

// https://api.openweathermap.org/data/2.5/weather?q=montreal&appid={apikey}&units=Metric
