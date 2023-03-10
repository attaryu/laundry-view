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
      const rawRole = action.payload.user.role.split('');
      const roleUpperCase = rawRole[0].toUpperCase() + rawRole.slice(1).join('');

      state.id = action.payload.user.id;
      state.name = action.payload.user.name;
      state.username = action.payload.user.username;
      state.role = roleUpperCase;
      state.requestToken = action.payload.request_token;
    },
  },
});

export const {
  pushUserData,
} = auth.actions;