import { configureStore } from '@reduxjs/toolkit';

import baseApi from '@/stores/baseApi';
import { auth } from '@/stores/auth/auth';
import filterReducer from '@/stores/filter/filter';

const store = configureStore({
  reducer: {
    auth: auth.reducer,
    filter: filterReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (gdm) => gdm().concat(baseApi.middleware),
});

export default store;
