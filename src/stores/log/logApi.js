// import { io } from 'socket.io-client';

import baseApi from '@/stores/baseApi';

export const logApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLog: build.query({
      query: () => '/log',
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
  useGetLogQuery,
} = logApi;
