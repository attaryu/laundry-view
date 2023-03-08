import { configureStore } from '@reduxjs/toolkit';

import baseApi from '@/stores/api/baseApi';

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (gdm) => gdm().concat(baseApi.middleware),
});

export default store;
