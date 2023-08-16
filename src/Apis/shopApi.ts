import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const shopApi = createApi({
  reducerPath: "shopApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin/shop",
    prepareHeaders: (headers: Headers) => {
      const token = localStorage.getItem("token");
      token && headers.append("token", token);
    },
  }),
  endpoints: (builder) => ({
    setShopStatus: builder.mutation({
      query: (status) => ({
        url: `/${status}`,
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
      }),
    }),

    getShopStatus: builder.query({
      query: () => ({
        url: "/status",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetShopStatusQuery, useSetShopStatusMutation } = shopApi;
export default shopApi;
