import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseApi = createApi({
  reducerPath: 'laundry-service',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3030/' }),
  endpoints: () => ({}),
});

export default baseApi;
