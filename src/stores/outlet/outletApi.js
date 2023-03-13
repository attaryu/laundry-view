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
      invalidatesTags: ['outlet', 'analisis'],
    }),

    getOutlet: build.query({
      query: ({ page = 1, search }) => {
        let query = '';

        if (search && search.length !== 0) {
          query = `&search=${search}`;
        }

        return `/outlet?page=${page}${query}`;
      },
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
      invalidatesTags: (result, error, args) => ([{ type: 'outlet', id: args }, 'analisis']),
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
