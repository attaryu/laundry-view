import { configureStore } from '@reduxjs/toolkit';

import baseApi from '@/stores/baseApi';
import { auth } from '@/stores/auth/auth';

const store = configureStore({
  reducer: {
    auth: auth.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (gdm) => gdm().concat(baseApi.middleware),
});

export default store;
