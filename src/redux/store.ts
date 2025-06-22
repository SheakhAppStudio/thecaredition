import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice/userSlice";
import admissionReducer from "./features/admission/admissionSlice/admissionSlcie";
import baseApi from "@/redux/features/api/baseApi"
export const store = configureStore({
  reducer: {
    users: userReducer,
    admission : admissionReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})


// ✅ Types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
