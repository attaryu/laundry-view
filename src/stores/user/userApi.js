import baseApi from '@/stores/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUser: build.query({
      query: ({
        page, search, role, idOutlet,
      }) => {
        let query = `/user?page=${page}`;

        if (search) query = `${query}&search=${search}`;
        if (role) query = `${query}&role=${role}`;
        if (idOutlet) query = `${query}&id_outlet=${idOutlet}`;

        return { url: query };
      },
    }),

    getSpecificUser: build.query({
      query: (userId) => `/user/${userId}`,
    }),

    updateUser: build.mutation({
      query: ({ userId, body }) => ({
        url: `/user/${userId}`,
        method: 'PUT',
        body,
      }),
    }),

    deleteUser: build.mutation({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useGetSpecificUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
