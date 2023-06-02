import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  id: "",
  firstName: "",
  lastName: "",
  username: "",
  role: "",
  token: "",
  expiredIn: "",
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const { id, firstName, lastName, username, role, token = "", expiredIn = "" } = action.payload;
      state.id = id;
      state.firstName = firstName;
      state.lastName = lastName;
      state.username = username;
      state.role = role;
      state.token = token;
      state.expiredIn = expiredIn;
    },
    resetUser(state, action) {
      const { id, firstName, lastName, username, role, token, expiredIn } = initialState;
      state.id = id;
      state.firstName = firstName;
      state.lastName = lastName;
      state.username = username;
      state.role = role;
      state.token = token;
      state.expiredIn = expiredIn;
    },
  },
});

export const setUser = (user) => async (dispatch, getState) => {
  dispatch(UserSlice.actions.setUser(user));
};

export const resetUser = () => async (dispatch, getState) => {
  dispatch(UserSlice.actions.resetUser());
};

export default UserSlice;
