import baseApi from '@/stores/baseApi';

export const logApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLog: build.query({
      query: () => '/log',
      transformResponse: (response) => response.payload,
    }),
  }),
});

export const {
  useGetLogQuery,
} = logApi;
