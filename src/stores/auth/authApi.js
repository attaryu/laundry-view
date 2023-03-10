import baseApi from '@/stores/baseApi';

export const authApi = baseApi.injectEndpoints({
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
        credentials: 'include',
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
        credentials: 'include',
      }),
    }),

    logout: build.mutation({
      query: () => ({
        url: '/login',
        method: 'DELETE',
        credentials: 'include',
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
