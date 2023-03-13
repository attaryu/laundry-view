import baseApi from '@/stores/baseApi';

const outletApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    createOutlet: build.mutation({
      query: (body) => ({
        url: '/outlet',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['outlet'],
    }),

    getOutlet: build.query({
      query: ({ page = 1, search }) => `/outlet?page=${page}${search?.length !== 0 ? `&search=${search}` : ''}`,
      providesTags: (result) => {
        if (result) {
          const tags = result.payload.map((data) => ({ type: 'outlet', id: data.id }));
          return ['outlet', ...tags];
        }
        return ['outlet'];
      },
    }),

    getDetailOutlet: build.query({
      query: (id) => `/outlet/${id}`,
      transformResponse: (response) => response.payload,
    }),

    editOutlet: build.mutation({
      query: ({ id, body }) => ({
        url: `/outlet/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, args) => ([{ type: 'outlet', id: args.id }]),
    }),

    deleteOutlet: build.mutation({
      query: (id) => ({
        url: `outlet/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, args) => ([{ type: 'outlet', id: args }]),
    }),
  }),
});

export const {
  useCreateOutletMutation,
  useGetOutletQuery,
  useGetDetailOutletQuery,
  useEditOutletMutation,
  useDeleteOutletMutation,
} = outletApi;
