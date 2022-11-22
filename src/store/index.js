import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./reducers/userSlice";

const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
  },
  devTools: true,
});

export default store;
