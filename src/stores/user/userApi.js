import baseApi from '@/stores/baseApi';

export const userApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getAllUser: build.query({
      query: ({ page = 1, search, role, idOutlet }) => {
        let query = '';

        if (search) query = `${query}&search=${search}`;
        if (role) query = `${query}&role=${role}`;
        if (idOutlet) query = `${query}&id_outlet=${idOutlet}`;

        return `/user?page=${page}${query}`;
      },
      providesTags: (result) => {
        if (result) {
          const tags = result.payload.map((data) => ({ type: 'user', id: data.id }));
          return ['user', ...tags];
        }
        return ['user'];
      },
    }),

    getSpecificUser: build.query({
      query: (id) => `/user/${id}`,
      transformResponse: (response) => response.payload,
      providesTags: (result, error, args) => ([{ type: 'user', id: args }]),
    }),

    updateUser: build.mutation({
      query: ({ id, body }) => ({
        url: `/user/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, args) => ([{ type: 'user', id: args.id }]),
    }),

    deleteUser: build.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, args) => ([{ type: 'user', id: args }]),
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useGetSpecificUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
