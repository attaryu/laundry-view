import baseApi from '@/stores/baseApi';

export const reportApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    transactionReport: build.query({
      query: ({ target, dateFrom, dateUntil }) => {
        let query = '';

        if (dateUntil) query = `${query}&dateUntil=${dateUntil}`;

        return `/report/transaction?target=${target}&dateFrom=${dateFrom}${query}`;
      },
      transformResponse: (response) => response.payload,
    }),
  }),
});

export const { useTransactionReportQuery } = reportApi;
