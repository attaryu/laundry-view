// import { io } from 'socket.io-client';

import baseApi from '@/stores/baseApi';

export const mailApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMail: build.query({
      query: () => '/email',
      transformResponse: (response) => response.payload,
      // onCacheEntryAdded: async (arg, { cacheDataLoaded, updateCachedData }) => {
      //   const socket = io('http://localhost:3030/');

      //   socket.on('email-path', (newEmail) => {

      //   });
      // },
    }),
  }),
});

export const {
  useGetMailQuery,
} = mailApi;
