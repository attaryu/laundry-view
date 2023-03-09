import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseApi = createApi({
  reducerPath: 'laundry-service',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3030',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.requestToken;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
});

export default baseApi;
