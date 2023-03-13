import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { pushUserData } from '@/stores/auth/auth';

const baseQueryOrigin = fetchBaseQuery({
  baseUrl: 'http://localhost:3030',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = sessionStorage.getItem('request_token');
    if (token) headers.set('authorization', `Bearer ${token}`);

    return headers;
  },
});

async function baseQuery(args, api, extraOptions) {
  let result = await baseQueryOrigin(args, api, extraOptions);

  if (result.error && /token/.test(result.error.data.message)) {
    const refreshResult = await baseQueryOrigin('/login', api, extraOptions);

    if (refreshResult.data) {
      sessionStorage.setItem('request_token', refreshResult.data.payload.request_token);
      api.dispatch(pushUserData({ ...refreshResult.data.payload }));
      result = await baseQueryOrigin(args, api, extraOptions);
    }
  }
  return result;
}

const baseApi = createApi({
  reducerPath: 'laundry-service',
  baseQuery,
  tagTypes: ['pelanggan', 'analisis'],
  endpoints: () => ({}),
});

export default baseApi;
