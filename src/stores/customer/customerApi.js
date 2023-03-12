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
    }),
  }),
});

export const {
  useGetCustomerQuery,
} = customerApi;
