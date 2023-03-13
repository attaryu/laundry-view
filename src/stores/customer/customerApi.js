import baseApi from '@/stores/baseApi';

export const customerApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getCustomer: build.query({
      query: ({ page, gender, search }) => {
        let query = '';

        if (gender && gender.length !== 0) {
          query = `&gender=${gender}`;
        }

        if (search && search.length !== 0) {
          query = `${query}&search=${search}`;
        }

        return `/customer?page=${page || 1}${query}`;
      },
      providesTags: (result) => {
        if (result) {
          const tags = result.payload.map((data) => ({ type: 'pelanggan', id: data.id }));
          return ['pelanggan', ...tags];
        }
        return ['pelanggan'];
      },
    }),

    getSpecificCustomer: build.query({
      query: (id) => `/customer/${id}`,
      transformResponse: (response) => response.payload,
      providesTags: (result, error, args) => ([{ type: 'pelanggan', id: args }]),
    }),

    editCustomer: build.mutation({
      query: ({ id, body }) => ({
        url: `/customer/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, args) => ([{ type: 'pelanggan', id: args.id }]),
    }),

    deleteCustomer: build.mutation({
      query: (id) => ({
        url: `/customer/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, args) => ([{ type: 'pelanggan', id: args }, 'analisis']),
    }),
  }),
});

export const {
  useGetCustomerQuery,
  useGetSpecificCustomerQuery,
  useEditCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
