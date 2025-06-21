import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// 1. Define the User type
export interface User {
 
  _id: string;
  name?: string;
  mobile?: string;
  email?: string;
  role?: string;
  adminPhoto?: string | string[] | null;
  permissions?: string[];
  instituteId?: string;
  password?: string;
}

// 2. Define the Redux state structure
interface UserState {
  users: User[];
  status: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
}

// 3. Initial state
const initialState: UserState = {
  users: [],
  status: false,
  currentPage: 0,
  itemsPerPage: 50,
  totalCount: 0,
};

// 4. Payload type for fetching users
type FetchUsersPayload = {
  data: {
    searchTerm?: string;
    page: number;
    limit: number;
  };
};

// 5. Async thunk to fetch users
export const fetchUsers = createAsyncThunk<
  { data: User[]; total: number },
  FetchUsersPayload
>("users/fetch", async ({ data }) => {
  const response = await axios.get(
    `/api/filter-users?search=${data.searchTerm || ""}&page=${data.page}&limit=${data.limit}`
  );
  return response.data;
});

// 6. Slice definition
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = true;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<{ data: User[]; total: number }>) => {
          state.status = false;
          state.users = action.payload.data;
          state.totalCount = action.payload.total;
        }
      )
      .addCase(fetchUsers.rejected, (state) => {
        state.status = false;
      });
  },
});

// 7. Export actions and reducer
export const { setCurrentPage, setItemsPerPage } = userSlice.actions;
export default userSlice.reducer;
