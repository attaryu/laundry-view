// import { io } from 'socket.io-client';

import baseApi from '@/stores/baseApi';

export const mailApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getMail: build.query({
      query: () => '/email',
      transformResponse: (response) => response.payload,
    }),
  }),
});

export const {
  useGetMailQuery,
} = mailApi;
