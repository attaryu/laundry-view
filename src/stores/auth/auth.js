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
      const rawRole = action.payload.role.split('');
      const roleUpperCase = rawRole[0].toUpperCase() + rawRole.slice(1).join('');

      state.id = action.payload.id;
      state.name = action.payload.name;
      state.username = action.payload.username;
      state.id_outlet = action.payload.id_outlet;
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
