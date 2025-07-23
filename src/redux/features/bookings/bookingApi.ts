import baseApi from "../api/baseApi";

interface Booking {
  id: string;
  // Add other booking properties as needed
}

interface GetBookingsParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

interface UpdateBookingStatusParams {
  id: string;
  status: string;
  confirmedPrice?: number; // Optional, if you want to include it
}

const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], GetBookingsParams>({
      query: ({ search, status, page, limit }) => 
        `/bookings/filter-bookings?search=${search}&status=${status}&page=${page}&limit=${limit}`,
      providesTags: ["Bookings"],
    }),
    getFilterDashboard: builder.query<any, void>({
      query: () => '/filter-dashboard',
      providesTags: ["Bookings"],
    }),
    updateBookingStatus: builder.mutation<Booking, UpdateBookingStatusParams>({
      query: ({ id, status, confirmedPrice }) => ({
        url: `/bookings/update-booking-status/${id}`,
        method: "PATCH",
        body: { status, confirmedPrice }
      }),
      invalidatesTags: ["Bookings"],
    }),
    deleteBooking: builder.mutation<void, string>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Bookings"],
    })
  }),
  overrideExisting: false,
});

export const { 
  useGetBookingsQuery, 
  useUpdateBookingStatusMutation, 
  useDeleteBookingMutation, 
  useGetFilterDashboardQuery 
} = bookingApi;