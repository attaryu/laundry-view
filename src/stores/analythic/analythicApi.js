import baseApi from '@/stores/baseApi';

export const analythicApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getAnalytic: build.query({
      queryFn: async (arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const transactionIntensity = await fetchWithBQ('/analytic/transaction/graph');
        if (transactionIntensity.error) return { error: transactionIntensity.error };

        const totalIncome = await fetchWithBQ(`/analytic/income${arg === 'today' ? '?today=true' : ''}`);
        if (totalIncome.error) return { error: totalIncome.error };

        const totalData = await fetchWithBQ('/analytic/total-data');

        return totalData.data ? {
          data: {
            income: totalIncome.data.payload.total,
            total: { ...totalData.data.payload },
            graph: transactionIntensity.data.payload.graph,
          },
        } : {
          error: totalData.error,
        };
      },
    }),
  }),
});

export const {
  useGetAnalyticQuery,
} = analythicApi;
