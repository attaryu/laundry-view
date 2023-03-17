import { createSlice } from '@reduxjs/toolkit';

export const auth = createSlice({
  name: 'auth',
  initialState: {
    id: '',
    name: '',
    username: '',
    id_outlet: '',
    role: '',
  },
  reducers: {
    pushUserData: (state, action) => {
      const rawRole = action.payload.user.role.split('');
      const roleUpperCase = rawRole[0].toUpperCase() + rawRole.slice(1).join('');

      state.id = action.payload.user.id;
      state.name = action.payload.user.name;
      state.username = action.payload.user.username;
      state.id_outlet = action.payload.user.id_outlet;
      state.role = roleUpperCase;
    },
    resetUser: (state) => {
      state.id = '';
      state.name = '';
      state.username = '';
      state.id_outlet = '';
      state.role = '';
    },
  },
});

export const {
  pushUserData,
  resetUser,
} = auth.actions;
