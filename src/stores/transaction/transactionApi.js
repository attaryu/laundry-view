import baseApi from '@/stores/baseApi';

export const transactionApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getTransaction: build.query({
      query: ({ page = 1, status, idOutlet, lunas, search }) => {
        let query = '';

        if (lunas) query = `${query}&lunas=${lunas}`;
        if (status) query = `${query}&status=${status}`;
        if (idOutlet) query = `${query}&id_outlet=${idOutlet}`;
        if (search) query = `${query}&search=${search}`;

        return `/transaction?page=${page}${query}`;
      },
      providesTags: (result) => {
        if (result) {
          const tags = result.payload.map((transaction) => ({ type: 'transaksi', id: transaction.kode_invoice }));
          return ['transaksi', ...tags];
        }
        return ['transaksi'];
      },
    }),

    getDetailTransaction: build.query({
      query: (kodeInvoice) => `/transaction/${kodeInvoice}`,
      transformResponse: (response) => response.payload,
      providesTags: (result, error, args) => ([{ type: 'transaksi', id: args }]),
    }),

    changeStatusTransaction: build.mutation({
      query: ({ kodeInvoice, status }) => ({
        url: `/transaction/${kodeInvoice}/status?status=${status}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, args) => ([{ type: 'transaksi', id: args.kodeInvoice }]),
    }),

    paidOffTransaction: build.mutation({
      query: ({ kodeInvoice, paidOff }) => ({
        url: `/transaction/${kodeInvoice}/bill/${paidOff}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, args) => ([{ type: 'transaksi', id: args.kodeInvoice }]),
    }),

    cancelTransaction: build.mutation({
      query: (kodeInvoice) => ({
        url: `/transaction/${kodeInvoice}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, args) => ([{ type: 'transaksi', id: args }]),
    }),

    createTransaction: build.mutation({
      query: (body) => ({
        url: '/transaction',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['transaksi'],
    }),
  }),
});

export const {
  useGetTransactionQuery,
  useChangeStatusTransactionMutation,
  useCancelTransactionMutation,
  useGetDetailTransactionQuery,
  usePaidOffTransactionMutation,
  useCreateTransactionMutation,
} = transactionApi;
