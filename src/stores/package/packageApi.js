import baseApi from '@/stores/baseApi';

export const packageApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getPackage: build.query({
      query: ({ page = 1, jenis, outletId, search }) => {
        let query = '';

        if (jenis) query = `${query}&jenis=${jenis}`;
        if (outletId) query = `${query}&id_outlet=${outletId}`;
        if (search) query = `${query}&search=${search}`;

        return `/package?page=${page}${query}`;
      },
      providesTags: (result) => {
        if (result) {
          const tags = result.payload.map((paket) => ({ type: 'paket', id: paket.id }));
          return ['paket', ...tags];
        }
        return ['paket'];
      },
    }),

    getSpecificPackage: build.query({
      query: (id) => `/package/${id}`,
      transformResponse: (response) => response.payload,
      providesTags: (result, error, args) => ([{ type: 'paket', id: args.id }]),
    }),

    getNamePackage: build.query({
      query: () => '/package/name',
      transformResponse: (response) => response.payload,
      providesTags: (result) => {
        if (result) {
          return [{ type: 'paket', id: result.id }];
        }
        return ['paket'];
      },
    }),

    addPackage: build.mutation({
      query: (body) => ({
        url: '/package',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['paket'],
    }),

    editPackage: build.mutation({
      query: ({ id, body }) => ({
        url: `/package/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, args) => ([{ type: 'paket', id: args.id }]),
    }),

    deletePackage: build.mutation({
      query: (id) => ({
        url: `/package/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, args) => ([{ type: 'paket', id: args }]),
    }),
  }),
});

export const {
  useGetPackageQuery,
  useAddPackageMutation,
  useDeletePackageMutation,
  useEditPackageMutation,
  useGetSpecificPackageQuery,
  useGetNamePackageQuery,
} = packageApi;
