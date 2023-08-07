import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SD_WeatherTypes } from "../utilities/SD";

const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: fetchBaseQuery({
    baseUrl: SD_WeatherTypes.API_BASE_URL,
  }),
  tagTypes: ["weather"],
  endpoints: (builder) => ({
    getWeather: builder.query({
      query: ({
        q = SD_WeatherTypes.LOCATION,
        appid = SD_WeatherTypes.API_KEY,
        units = SD_WeatherTypes.UNITS,
      }) => ({
        url: "",
        method: "GET",
        params: {
          q,
          appid,
          units,
        },
      }),
      providesTags: ["weather"],
    }),
  }),
});
export const { useGetWeatherQuery } = weatherApi;
export default weatherApi;
