import baseApi from '@/stores/baseApi';

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    register: build.mutation({
      query: (body) => ({
        url: '/register',
        method: 'POST',
        body,
      }),
    }),

    login: build.mutation({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
      transformResponse: (response) => ({
        user: response.payload,
        token: response.token,
      }),
    }),

    generateRequestToken: build.query({
      query: () => ({
        url: '/login',
        method: 'GET',
      }),
      keepUnusedDataFor: 0.1,
    }),

    logout: build.mutation({
      query: () => ({
        url: '/login',
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGenerateRequestTokenQuery,
  useLogoutMutation,
} = authApi;
