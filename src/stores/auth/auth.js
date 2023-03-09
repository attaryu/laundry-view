import { createSlice } from '@reduxjs/toolkit';

export const auth = createSlice({
  name: 'auth',
  initialState: {
    id: '',
    name: '',
    username: '',
    role: '',
    requestToken: '',
  },
  reducers: {
    pushUserData: (state, action) => {
      state.id = action.payload.user.id;
      state.name = action.payload.user.name;
      state.username = action.payload.user.username;
      state.role = action.payload.user.role;
      state.requestToken = action.payload.token.request_token;
    },
  },
});

export const { pushUserData } = auth.actions;
